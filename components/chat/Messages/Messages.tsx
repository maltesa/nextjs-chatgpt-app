import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { SystemPrompt } from '../Settings'
import { uiMessagesAtom } from '../state'
import { useAi } from '../useAI'
import { Message } from './Message'

export function Messages() {
  const { askAI, answerInProgress } = useAi()
  const [uiMessages, setUiMessages] = useAtom(uiMessagesAtom)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [uiMessages])

  const handleListDelete = (uid: string) =>
    setUiMessages((list) => list.filter((message) => message.uid !== uid))

  const handleListEdit = (uid: string, newText: string) =>
    setUiMessages((list) =>
      list.map((message) => (message.uid === uid ? { ...message, text: newText } : message))
    )

  const handleListRunAgain = (uid: string) => {
    const uidPosition = uiMessages.findIndex((msg) => msg.uid === uid)
    if (uidPosition === -1) return

    const updatedMessages = uiMessages.slice(0, uidPosition + 1)
    setUiMessages(updatedMessages)

    askAI(updatedMessages)
  }

  return (
    <div className="relative flex-grow bg-mauve">
      {uiMessages.length <= 0 ? (
        <SystemPrompt className="absolute top-1/2 left-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <ul>
          {uiMessages.map((message) => (
            <Message
              key={message.uid}
              uiMessage={message}
              onDelete={() => handleListDelete(message.uid)}
              onEdit={(newText) => handleListEdit(message.uid, newText)}
              onRunAgain={() => handleListRunAgain(message.uid)}
            />
          ))}

          {/* Scroll Anchor */}
          <div ref={messagesEndRef} />
        </ul>
      )}
    </div>
  )
}
