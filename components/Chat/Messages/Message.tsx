import {
  ArrowPathIcon,
  ClipboardDocumentIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useState } from 'react'

import { Avatar, IconButton, Textarea } from '@/components/ui'
import { copyToClipboard } from '@/lib/utils'

import { CodeBlock } from './CodeBlock'
import { ExplainError } from './ExplainError'
import { parseMessage } from './parseMessage'
import { UiMessage } from './types'

interface Props {
  uiMessage: UiMessage
  onDelete: () => void
  onEdit: (text: string) => void
  onRunAgain: () => void
}

/**
 * The Message component is a customizable chat message UI component that supports
 * different roles (user, assistant, and system), text editing, syntax highlighting,
 * and code execution using Sandpack for TypeScript, JavaScript, and HTML code blocks.
 * The component also provides options for copying code to clipboard and expanding
 * or collapsing long user messages.
 */
export function Message({ uiMessage: message, onEdit, onDelete, onRunAgain }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(message.text)
  const isUserMessage = message.role === 'user'

  const handleMenuCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    copyToClipboard(message.text)
  }

  const handleMenuEdit = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!isEditing) setEditedText(message.text)
    setIsEditing(!isEditing)
  }

  const handleMenuRunAgain = (e: React.MouseEvent) => {
    e.preventDefault()
    onRunAgain()
  }

  const handleEditTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedText(e.target.value)
  }

  const handleEditKeyPressed = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
      onEdit(editedText)
    }
  }

  const tooltipDirection = isUserMessage ? 'right' : 'left'

  return (
    <li
      className={clsx(
        'group relative flex gap-x-4 whitespace-pre-wrap border-b border-primary-600/10 px-4 py-4',
        isUserMessage ? 'flex-row-reverse bg-primary-50/70' : 'bg-white'
      )}
    >
      {/* Avatar */}
      <div className="flex flex-col items-start gap-2">
        {isUserMessage ? <Avatar color="primary">ME</Avatar> : <Avatar color="light">AI</Avatar>}
      </div>

      {/* Message */}
      {isEditing ? (
        <Textarea
          autoFocus
          minRows={1}
          value={editedText}
          className="flex-grow"
          onChange={handleEditTextChanged}
          onKeyDown={handleEditKeyPressed}
        />
      ) : (
        <div className="flex flex-grow-0 flex-col justify-center">
          {/* Edit / Delete / Rerun Message */}
          <div
            className={clsx(
              'absolute bottom-2 hidden gap-2 group-hover:inline-flex',
              isUserMessage ? 'left-2' : 'right-2'
            )}
          >
            <IconButton
              aria-label="Copy to clipboard"
              data-balloon-pos={tooltipDirection}
              icon={ClipboardDocumentIcon}
              size="sm"
              onClick={handleMenuCopy}
            />
            <IconButton
              aria-label="Edit"
              data-balloon-pos={tooltipDirection}
              icon={PencilIcon}
              size="sm"
              onClick={handleMenuEdit}
            />
            {isUserMessage && (
              <IconButton
                aria-label="Rerun"
                data-balloon-pos={tooltipDirection}
                icon={ArrowPathIcon}
                size="sm"
                onClick={handleMenuRunAgain}
              />
            )}
            <IconButton
              aria-label="Delete"
              data-balloon-pos={tooltipDirection}
              disabled={message.role === 'system'}
              icon={TrashIcon}
              size="sm"
              onClick={onDelete}
            />
          </div>

          {/* Actual Message */}
          {parseMessage(message.text).map((block, index) => {
            switch (block.type) {
              case 'code':
                return <CodeBlock key={index} codeBlock={block} />

              case 'text':
                return (
                  <span
                    key={index}
                    className={isUserMessage ? 'text-primary-800' : 'text-gray-600'}
                  >
                    {block.content}
                  </span>
                )
            }
          })}

          <ExplainError {...message} />
        </div>
      )}
    </li>
  )
}
