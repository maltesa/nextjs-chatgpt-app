import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import { uiMessagesAtom } from '../state'
import { useAi } from '../useAI'
import { Message } from './Message'

export function Messages() {
  const { askAI, answerInProgress } = useAi()
  const [uiMessages, setUiMessages] = useAtom(uiMessagesAtom)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView()
  }, [uiMessages])

  const handleListDelete = (uid: string) =>
    setUiMessages((list) => list.filter((message) => message.uid !== uid))

  const handleListEdit = (uid: string, newText: string) =>
    setUiMessages((list) =>
      list.map((message) => (message.uid === uid ? { ...message, text: newText } : message))
    )

  const handleListRunAgain = (uid: string) => {
    if (answerInProgress) return

    const uidPosition = uiMessages.findIndex((msg) => msg.uid === uid)
    if (uidPosition === -1) return

    const updatedMessages = uiMessages.slice(0, uidPosition + 1)
    setUiMessages(updatedMessages)

    askAI(updatedMessages)
  }

  return (
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
  )
}
