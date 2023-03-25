import { ForwardIcon, Sandpack, SandpackFiles } from '@codesandbox/sandpack-react'
import * as React from 'react'

import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import 'prismjs/themes/prism.css'

import { Alert, Avatar, Button, Textarea } from '@/components/ui'
import {
  BackspaceIcon,
  ClipboardDocumentIcon,
  ClipboardIcon,
  PencilIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { CustomLink } from './util/CustomLink'

// One message in the chat

export interface UiMessage {
  uid: string
  sender: 'You' | 'Bot' | string
  role: 'assistant' | 'system' | 'user'
  text: string
  model: string // optional for 'assistant' roles (not user messages)
  avatar: string | React.ElementType | null
}

/// Utilities to split the message into blocks of text and code

type MessageBlock = { type: 'text'; content: string } | CodeMessageBlock
type CodeMessageBlock = {
  type: 'code'
  content: string
  language: string | null
  complete: boolean
  code: string
}

const inferLanguage = (markdownLanguage: string, code: string): string | null => {
  // we have an hint
  if (markdownLanguage) {
    // no dot: it's a syntax-highlight language
    if (!markdownLanguage.includes('.')) return markdownLanguage

    // dot: there's probably an extension
    const extension = markdownLanguage.split('.').pop()
    if (extension) {
      const languageMap: { [key: string]: string } = {
        cs: 'csharp',
        html: 'html',
        java: 'java',
        js: 'javascript',
        json: 'json',
        jsx: 'javascript',
        md: 'markdown',
        py: 'python',
        sh: 'bash',
        ts: 'typescript',
        tsx: 'typescript',
        xml: 'xml',
      }
      const language = languageMap[extension]
      if (language) return language
    }
  }

  // based on how the code starts, return the language
  if (code.startsWith('<DOCTYPE html') || code.startsWith('<!DOCTYPE')) return 'html'
  if (code.startsWith('<')) return 'xml'
  if (code.startsWith('from ')) return 'python'
  if (code.startsWith('import ') || code.startsWith('export ')) return 'typescript' // or python
  if (code.startsWith('interface ') || code.startsWith('function ')) return 'typescript' // ambiguous
  if (code.startsWith('package ')) return 'java'
  if (code.startsWith('using ')) return 'csharp'
  return null
}

const parseAndHighlightCodeBlocks = (text: string): MessageBlock[] => {
  const codeBlockRegex = /`{3,}([\w\\.]+)?\n([\s\S]*?)(`{3,}|$)/g
  const result: MessageBlock[] = []

  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const markdownLanguage = (match[1] || '').trim()
    const code = match[2]?.trim() || ''
    const blockEnd = match[3] || ''

    // Load the specified language if it's not loaded yet
    // NOTE: this is commented out because it inflates the size of the bundle by 200k
    // if (!Prism.languages[language]) {
    //   try {
    //     require(`prismjs/components/prism-${language}`);
    //   } catch (e) {
    //     console.warn(`Prism language '${language}' not found, falling back to 'typescript'`);
    //   }
    // }

    const codeLanguage = inferLanguage(markdownLanguage, code)
    const highlightLanguage = codeLanguage || 'typescript'
    const highlightedCode = Prism.highlight(
      code,
      Prism.languages[highlightLanguage] || Prism.languages.typescript!,
      highlightLanguage
    )

    result.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    result.push({
      type: 'code',
      content: highlightedCode,
      language: codeLanguage,
      complete: blockEnd.startsWith('```'),
      code,
    })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    result.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return result
}

const copyToClipboard = (text: string) => {
  if (typeof navigator !== 'undefined')
    navigator.clipboard
      .writeText(text)
      .then(() => console.log('Message copied to clipboard'))
      .catch((err) => console.error('Failed to copy message: ', err))
}

/// Renderers for the different types of message blocks

type SandpackConfig = { files: SandpackFiles; template: 'vanilla-ts' | 'vanilla' }

const runnableLanguages = ['html', 'javascript', 'typescript']

function RunnableCode({ codeBlock }: { codeBlock: CodeMessageBlock }): JSX.Element | null {
  let config: SandpackConfig
  switch (codeBlock.language) {
    case 'html':
      config = {
        template: 'vanilla',
        files: { '/index.html': codeBlock.code, '/index.js': '' },
      }
      break
    case 'javascript':
    case 'typescript':
      config = {
        template: 'vanilla-ts',
        files: { '/index.ts': codeBlock.code },
      }
      break
    default:
      return null
  }
  return (
    <Sandpack
      {...config}
      theme="auto"
      options={{ showConsole: true, showConsoleButton: true, showTabs: true, showNavigator: false }}
    />
  )
}

function CodeBlock({ codeBlock }: { codeBlock: CodeMessageBlock }) {
  const [showSandpack, setShowSandpack] = React.useState(false)

  const handleCopyToClipboard = () => copyToClipboard(codeBlock.code)

  const handleToggleSandpack = () => setShowSandpack(!showSandpack)

  const showRunIcon =
    codeBlock.complete && !!codeBlock.language && runnableLanguages.includes(codeBlock.language)

  return (
    <div className="group relative block bg-gray-100 p-1.5 font-medium">
      <Button
        variant="primary"
        icon={ClipboardIcon}
        className="absolute top-0 right-0 z-10 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleCopyToClipboard}
      />
      {showRunIcon && (
        <Button
          variant="light"
          onClick={handleToggleSandpack}
          className="right-50 absolute top-0 z-10 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {showSandpack ? <StopIcon /> : <PlayIcon />}
        </Button>
      )}
      <div dangerouslySetInnerHTML={{ __html: codeBlock.content }} />
      {showRunIcon && showSandpack && <RunnableCode codeBlock={codeBlock} />}
    </div>
  )
}

function prettyBaseModel(model: string): string {
  if (model.startsWith('gpt-4')) return 'gpt-4'
  if (model.startsWith('gpt-3.5-turbo')) return '3.5-turbo'
  return model
}

function explainErrorInMessage(message: UiMessage) {
  let errorMessage: JSX.Element | null = null
  const isAssistantError =
    message.role === 'assistant' &&
    (message.text.startsWith('Error: ') || message.text.startsWith('OpenAI API error: '))
  if (isAssistantError) {
    if (message.text.startsWith('OpenAI API error: 429 Too Many Requests')) {
      // TODO: retry at the api/chat level a few times instead of showing this error
      errorMessage = (
        <>
          The model appears to be occupied at the moment. Kindly select <b>GPT-3.5 Turbo</b> via
          settings icon, or give it another go by selecting <b>Run again</b> from the message menu.
        </>
      )
    } else if (message.text.includes('"model_not_found"')) {
      // note that "model_not_found" is different than "The model `gpt-xyz` does not exist" message
      errorMessage = (
        <>
          Your API key appears to be unauthorized for {message.model || 'this model'}. You can
          change to <b>GPT-3.5 Turbo</b> via the settings icon and simultaneously{' '}
          <CustomLink href="https://openai.com/waitlist/gpt-4-api" target="_blank">
            request access
          </CustomLink>{' '}
          to the desired model.
        </>
      )
    } else if (message.text.includes('"context_length_exceeded"')) {
      // TODO: propose to summarize or split the input?
      const pattern: RegExp = /maximum context length is (\d+) tokens.+resulted in (\d+) tokens/
      const match = pattern.exec(message.text)
      const usedText = match ? ` (${match[2]} tokens, max ${match[1]})` : ''
      errorMessage = (
        <>
          This thread <b>surpasses the maximum size</b> allowed for {message.model || 'this model'}
          {usedText}. Please consider removing some earlier messages from the conversation, start a
          new conversation, choose a model with larger context, or submit a shorter new message.
        </>
      )
    }
  }
  return { errorMessage, isAssistantError }
}

/**
 * The Message component is a customizable chat message UI component that supports
 * different roles (user, assistant, and system), text editing, syntax highlighting,
 * and code execution using Sandpack for TypeScript, JavaScript, and HTML code blocks.
 * The component also provides options for copying code to clipboard and expanding
 * or collapsing long user messages.
 *
 * @param {UiMessage} props.uiMessage - The UI message object containing message data.
 * @param {Function} props.onDelete - The function to call when the delete button is clicked.
 * @param {Function} props.onEdit - The function to call when the edit button is clicked and the edited text is submitted.
 */
export function Message(props: {
  uiMessage: UiMessage
  onDelete: () => void
  onEdit: (text: string) => void
  onRunAgain: () => void
}) {
  const message = props.uiMessage

  // viewing
  const [forceExpanded, setForceExpanded] = React.useState(false)

  // editing
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedText, setEditedText] = React.useState(message.text)

  const closeMenu = () => setMenuAnchor(null)

  const handleMenuCopy = (e: React.MouseEvent) => {
    copyToClipboard(message.text)
    e.preventDefault()
    closeMenu()
  }

  const handleMenuEdit = (e: React.MouseEvent) => {
    if (!isEditing) setEditedText(message.text)
    setIsEditing(!isEditing)
    e.preventDefault()
    closeMenu()
  }

  const handleMenuRunAgain = (e: React.MouseEvent) => {
    props.onRunAgain()
    e.preventDefault()
    closeMenu()
  }

  const handleEditTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEditedText(e.target.value)

  const handleEditKeyPressed = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
      props.onEdit(editedText)
    }
  }

  const handleExpand = () => setForceExpanded(true)

  // soft error handling
  const { isAssistantError, errorMessage } = explainErrorInMessage(message)

  // user message truncation
  let collapsedText = message.text
  let isCollapsed = false
  if (!forceExpanded && message.role === 'user') {
    const lines = message.text.split('\n')
    if (lines.length > 10) {
      collapsedText = lines.slice(0, 10).join('\n')
      isCollapsed = true
    }
  }

  return (
    <li
      className={clsx(
        'flex items-start gap-x-4 whitespace-pre-wrap border-b px-4 py-4',
        message.sender === 'You' && 'flex-row-reverse bg-primary-50/70'
      )}
    >
      {/* Author */}

      <div
        className="flex flex-col items-start gap-2"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
      >
        <Avatar color={message.role === 'user' ? 'primary' : 'light'}>{message.role[0]}</Avatar>

        {/* message operations menu (floating) */}
        {!!menuAnchor && (
          <div onClick={closeMenu}>
            <div onClick={handleMenuCopy}>
              <ClipboardDocumentIcon />
              Copy
            </div>
            <div onClick={handleMenuEdit}>
              <PencilIcon />
              {isEditing ? 'Discard' : 'Edit'}
            </div>
            <hr />
            <button onClick={handleMenuRunAgain} disabled={message.role !== 'user'}>
              <ForwardIcon />
              Run again
            </button>
            <button onClick={props.onDelete} disabled={message.role === 'system'}>
              <BackspaceIcon />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Edit / Blocks */}

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
        <div className="flex-grow-0 text-gray-700">
          {parseAndHighlightCodeBlocks(collapsedText).map((part, index) =>
            part.type === 'code' ? (
              <CodeBlock key={index} codeBlock={part} />
            ) : (
              <span key={index}>{part.content}</span>
            )
          )}
          {errorMessage && (
            <Alert variant="danger" className="mt-1">
              {errorMessage}
            </Alert>
          )}
          {isCollapsed && (
            <Button variant="light" onClick={handleExpand}>
              ... expand ...
            </Button>
          )}
        </div>
      )}
    </li>
  )
}
