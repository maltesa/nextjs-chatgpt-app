import { MicrophoneIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { DragEventHandler, KeyboardEventHandler, useCallback, useState } from 'react'

import { Button, Textarea } from '@/components/ui'
import { useSpeechRecognition } from '@/lib/speechRecognition'

import { createUiMessage } from '../Messages'
import { uiMessagesAtom } from '../state'
import { useAi } from '../useAI'

/// Text template helpers

const PromptTemplates = {
  PasteText: '{{input}}\n\n{{clipboard}}\n',
  PasteCode: '{{input}}\n\n```\n{{clipboard}}\n```\n',
  PasteFile: '{{input}}\n\n```{{fileName}}\n{{fileText}}\n```\n',
} as const

function expandPromptTemplate(template: string, dict: object) {
  return (inputValue: string): string => {
    let expanded = template.replaceAll('{{input}}', (inputValue || '').trim()).trim()
    for (const [key, value] of Object.entries(dict))
      expanded = expanded.replaceAll(`{{${key}}}`, value)

    return expanded
  }
}

/**
 * A React component for composing and sending messages in a chat-like interface.
 * Supports pasting text and code from the clipboard, and a local history of sent messages.
 *
 */
export function Composer() {
  const { askAI, answerInProgress } = useAi()
  const [uiMessages, setUiMessages] = useAtom(uiMessagesAtom)
  const [isDragging, setIsDragging] = useState(false)
  const [userMessage, setUserMessage] = useState('')

  const { isSpeechEnabled, isRecordingSpeech, startRecording } = useSpeechRecognition(
    useCallback((transcript: string) => setUserMessage((current) => `${current} ${transcript}`), [])
  )

  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      if (e.key !== 'Enter' || e.shiftKey) return

      e.preventDefault()
      const text = (e.currentTarget.value || '').trim()
      if (text.length <= 0) return
      const newUiMessages = [...uiMessages, createUiMessage('user', text)]

      setUiMessages(newUiMessages)
      askAI(newUiMessages)
      setUserMessage('')
    },
    [askAI, setUiMessages, uiMessages]
  )

  const eatDragEvent = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleMessageDragEnter: DragEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      eatDragEvent(e)
      setIsDragging(true)
    },
    [eatDragEvent]
  )

  const handleOverlayDragLeave: DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      eatDragEvent(e)
      setIsDragging(false)
    },
    [eatDragEvent]
  )

  const handleOverlayDragOver: DragEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      eatDragEvent(e)
    },
    [eatDragEvent]
  )

  const handleOverlayDrop: DragEventHandler<HTMLDivElement> = useCallback(
    async (e) => {
      eatDragEvent(e)
      setIsDragging(false)

      // paste Files
      let text = userMessage
      const files = Array.from(e.dataTransfer.files)
      if (files.length) {
        // Paste all files
        for (const file of files)
          text = expandPromptTemplate(PromptTemplates.PasteFile, {
            fileName: file.name,
            fileText: await file.text(),
          })(text)
        setUserMessage(text)
        return
      }

      // detect failure of dropping from VSCode
      if (e.dataTransfer.types.indexOf('codeeditors') >= 0) {
        setUserMessage(text + '\nPasting from VSCode is not supported! Fixme. Anyone?')
        return
      }

      // paste Text
      const droppedText = e.dataTransfer.getData('text')
      if (droppedText) {
        text = expandPromptTemplate(PromptTemplates.PasteText, { clipboard: droppedText })(text)
        setUserMessage(text)
        return
      }

      // NOTE for VSCode - a Drag & Drop does not transfer the File object
      // https://github.com/microsoft/vscode/issues/98629#issuecomment-634475572
      console.log(
        'Unhandled Drop event. Contents: ',
        e.dataTransfer.types.map((t) => `${t}: ${e.dataTransfer.getData(t)}`)
      )
    },
    [eatDragEvent, userMessage]
  )

  const textPlaceholder: string = 'Type a message...'

  return (
    <div className="sticky bottom-0 z-10 border-t bg-gray-100 p-2">
      {/* Message edit box, with Drop overlay */}
      <div className="relative flex">
        <Textarea
          autoFocus
          className="w-full"
          size="md"
          minRows={3}
          placeholder={textPlaceholder}
          value={userMessage}
          onChange={(e) => setUserMessage(e.currentTarget.value)}
          onDragEnter={handleMessageDragEnter}
          onKeyDown={handleKeyPress}
        />

        <div
          className={clsx(
            'absolute inset-0 z-10 items-center justify-evenly border-2 border-dashed',
            isDragging ? 'flex' : 'hidden'
          )}
          onDragLeave={handleOverlayDragLeave}
          onDragOver={handleOverlayDragOver}
          onDrop={handleOverlayDrop}
        >
          <h2 className="pointer-events-none text-xl">Drop it like it&#39;s hot 🥵</h2>
        </div>

        {isSpeechEnabled && (
          <Button
            onClick={startRecording}
            icon={MicrophoneIcon}
            variant={isRecordingSpeech ? 'danger' : 'primary'}
            className="!absolute bottom-2 right-2 h-10 w-10 !rounded-full"
            size="sm"
          />
        )}
      </div>
    </div>
  )
}
