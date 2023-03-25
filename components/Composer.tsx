import React from 'react'

import { useSpeechRecognition } from '@/lib/speechRecognition'
import { useComposerStore } from '@/lib/store'

import { Button, Textarea } from '@/components/ui'
import {
  ArrowUpIcon,
  ClipboardIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { NoSSR } from './util/NoSSR'

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
 * Note: Useful bash trick to generate code from a list of files:
 *       $ for F in *.ts; do echo; echo "\`\`\`$F"; cat $F; echo; echo "\`\`\`"; done | clip
 *
 * @param {boolean} isDeveloper - Flag to indicate if the user is a developer.
 * @param {boolean} disableSend - Flag to disable the send button.
 * @param {(text: string) => void} sendMessage - Function to send the composed message.
 */
export function Composer({
  isDeveloper,
  disableSend,
  sendMessage,
}: {
  isDeveloper: boolean
  disableSend: boolean
  sendMessage: (text: string) => void
}) {
  // state
  const [composeText, setComposeText] = React.useState('')
  const { history, appendMessageToHistory } = useComposerStore((state) => ({
    history: state.history,
    appendMessageToHistory: state.appendMessageToHistory,
  }))
  const [historyAnchor, setHistoryAnchor] = React.useState<HTMLButtonElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const attachmentFileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSendClicked = () => {
    const text = (composeText || '').trim()
    if (text.length) {
      setComposeText('')
      sendMessage(text)
      appendMessageToHistory(text)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!disableSend) handleSendClicked()
      e.preventDefault()
    }
  }

  const onSpeechResultCallback = React.useCallback((transcript: string) => {
    setComposeText((current) => current + ' ' + transcript)
  }, [])

  const { isSpeechEnabled, isRecordingSpeech, startRecording } =
    useSpeechRecognition(onSpeechResultCallback)

  const eatDragEvent = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMessageDragEnter = (e: React.DragEvent) => {
    eatDragEvent(e)
    setIsDragging(true)
  }

  const handleOverlayDragLeave = (e: React.DragEvent) => {
    eatDragEvent(e)
    setIsDragging(false)
  }

  const handleOverlayDragOver = (e: React.DragEvent) => {
    eatDragEvent(e)
    // e.dataTransfer.dropEffect = 'copy';
  }

  const handleOverlayDrop = async (e: React.DragEvent) => {
    eatDragEvent(e)
    setIsDragging(false)

    // paste Files
    let text = composeText
    const files = Array.from(e.dataTransfer.files)
    if (files.length) {
      // Paste all files
      for (const file of files)
        text = expandPromptTemplate(PromptTemplates.PasteFile, {
          fileName: file.name,
          fileText: await file.text(),
        })(text)
      setComposeText(text)
      return
    }

    // detect failure of dropping from VSCode
    if (e.dataTransfer.types.indexOf('codeeditors') >= 0) {
      setComposeText(text + '\nPasting from VSCode is not supported! Fixme. Anyone?')
      return
    }

    // paste Text
    const droppedText = e.dataTransfer.getData('text')
    if (droppedText) {
      text = expandPromptTemplate(PromptTemplates.PasteText, { clipboard: droppedText })(text)
      setComposeText(text)
      return
    }

    // NOTE for VSCode - a Drag & Drop does not transfer the File object
    // https://github.com/microsoft/vscode/issues/98629#issuecomment-634475572
    console.log(
      'Unhandled Drop event. Contents: ',
      e.dataTransfer.types.map((t) => `${t}: ${e.dataTransfer.getData(t)}`)
    )
  }

  const handleAttachmentChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    let text = composeText
    for (let i = 0; i < files.length; i++)
      text = expandPromptTemplate(PromptTemplates.PasteFile, {
        fileName: files[i]?.name,
        fileText: await files[i]?.text(),
      })(text)
    setComposeText(text)
  }

  const handleOpenAttachmentPicker = () => attachmentFileInputRef.current?.click()

  const pasteFromClipboard = async () => {
    const clipboardContent = ((await navigator.clipboard.readText()) || '').trim()
    if (clipboardContent) {
      const template = isDeveloper ? PromptTemplates.PasteCode : PromptTemplates.PasteText
      setComposeText(expandPromptTemplate(template, { clipboard: clipboardContent }))
    }
  }

  const pasteFromHistory = (text: string) => {
    setComposeText(text)
    hideHistory()
  }

  const showHistory: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setHistoryAnchor(event.currentTarget)
  }

  const hideHistory = () => setHistoryAnchor(null)

  const textPlaceholder: string = 'Type a message...' // 'Enter your message...\n  <enter> send\n  <shift>+<enter> new line\n  ``` code';*/

  return (
    <div className="flex gap-2">
      {/* Text Input & VButtons */}
      <div className="flex-grow">
        <div className="flex gap-2">
          {/* Vertical Buttons Bar */}
          <div className="flex flex-col gap-2">
            <Button
              block
              aria-label={`Attach ${isDeveloper ? 'code' : 'text'} files · also drag-and-drop 👇`}
              data-balloon-pos="right"
              icon={PaperClipIcon}
              variant="light"
              onClick={handleOpenAttachmentPicker}
            />

            <Button
              block
              aria-label={isDeveloper ? 'Paste code' : 'Paste'}
              data-balloon-pos="right"
              icon={ClipboardIcon}
              variant="light"
              onClick={pasteFromClipboard}
            />

            <input
              type="file"
              multiple
              hidden
              ref={attachmentFileInputRef}
              onChange={handleAttachmentChanged}
            />
          </div>

          {/* Message edit box, with Drop overlay */}
          <div className="relative flex-grow">
            <Textarea
              autoFocus
              className="w-full"
              size="md"
              minRows={5}
              maxRows={12}
              placeholder={textPlaceholder}
              value={composeText}
              onKeyDown={handleKeyPress}
              onDragEnter={handleMessageDragEnter}
              onChange={(e) => setComposeText(e.target.value)}
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
              <h2 className="pointer-events-none text-xl">I will hold on to this for you</h2>
            </div>

            {isSpeechEnabled && (
              <Button
                onClick={startRecording}
                icon={MicrophoneIcon}
                variant={isRecordingSpeech ? 'danger' : 'primary'}
                className="!absolute top-2 right-2 h-10 w-10 !rounded-full"
                size="sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Other Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          disabled={disableSend}
          icon={PaperAirplaneIcon}
          size="lg"
          onClick={handleSendClicked}
        />
        <NoSSR>
          {history.length > 0 && (
            <>
              <Button
                variant="light"
                className="mr-1 md:hidden"
                icon={ArrowUpIcon}
                onClick={showHistory}
              />
              <Button variant="light" color="neutral" icon={ArrowUpIcon} onClick={showHistory}>
                History
              </Button>
            </>
          )}
        </NoSSR>
      </div>

      {/* History menu with all the line items (only if shown) */}
      {!!historyAnchor && (
        <div onClick={hideHistory}>
          <div>Reuse messages 💬</div>
          <hr />
          {history.map((item, index) => (
            <div key={'compose-history-' + index} onClick={() => pasteFromHistory(item.text)}>
              {item.count > 1 && <h2 className="mr-1 text-2xl">({item.count})</h2>}
              {item.text.length > 60 ? item.text.slice(0, 58) + '...' : item.text}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
