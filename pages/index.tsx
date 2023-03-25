import * as React from 'react'

import { Composer } from '@/components/Composer'
import { Message, UiMessage } from '@/components/Message'
import { Settings, isValidOpenAIApiKey } from '@/components/Settings'
import { NoSSR } from '@/components/util/NoSSR'
import { GptChatModels, SystemPurposeId, SystemPurposes, useSettingsStore } from '@/lib/store'

import { Button, Select } from '@/components/ui'
import { BackspaceIcon, CogIcon } from '@heroicons/react/24/solid'
import { ChatApiInput } from './api/chat'

/// UI Messages configuration

const MessageDefaults: {
  [key in UiMessage['role']]: Pick<UiMessage, 'role' | 'sender' | 'avatar'>
} = {
  system: {
    role: 'system',
    sender: 'Bot',
    avatar: 'https://em-content.zobj.net/thumbs/120/apple/325/robot_1f916.png',
  },
  user: {
    role: 'user',
    sender: 'You',
    avatar: 'https://mui.com/static/images/avatar/2.jpg',
  },
  assistant: {
    role: 'assistant',
    sender: 'Bot',
    avatar: 'https://www.svgrepo.com/show/306500/openai.svg',
  },
}

const createUiMessage = (role: UiMessage['role'], text: string): UiMessage => ({
  uid: Math.random().toString(36).substring(2, 15),
  text: text,
  model: '',
  ...MessageDefaults[role],
})

/// Chat ///

export default function Conversation() {
  const { apiKey, chatModelId, systemPurposeId, setSystemPurpose } = useSettingsStore((state) => ({
    apiKey: state.apiKey,
    chatModelId: state.chatModelId,
    systemPurposeId: state.systemPurposeId,
    setSystemPurpose: state.setSystemPurposeId,
  }))
  const [messages, setMessages] = React.useState<UiMessage[]>([])
  const [disableCompose, setDisableCompose] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  React.useEffect(() => {
    // show the settings at startup if the API key is not present
    if (!!process.env.REQUIRE_USER_API_KEYS && !isValidOpenAIApiKey(apiKey)) setSettingsOpen(true)
  }, [apiKey])

  const handleListClear = () => setMessages([])

  const handleListDelete = (uid: string) =>
    setMessages((list) => list.filter((message) => message.uid !== uid))

  const handleListEdit = (uid: string, newText: string) =>
    setMessages((list) =>
      list.map((message) => (message.uid === uid ? { ...message, text: newText } : message))
    )

  const handleListRunAgain = (uid: string) => {
    // take all messages until we get to uid, then remove the rest
    const uidPosition = messages.findIndex((message) => message.uid === uid)
    if (uidPosition === -1) return
    const conversation = messages.slice(0, uidPosition + 1)
    setMessages(conversation)

    // disable the composer while the bot is replying
    setDisableCompose(true)
    getBotMessageStreaming(conversation).then(() => setDisableCompose(false))
  }

  const handlePurposeChange = (purpose: SystemPurposeId | null) => {
    if (!purpose) return

    if (purpose === 'Custom') {
      const systemMessage = prompt(
        'Enter your custom AI purpose',
        SystemPurposes['Custom'].systemMessage
      )
      SystemPurposes['Custom'].systemMessage = systemMessage || ''
    }

    setSystemPurpose(purpose)
  }

  const getBotMessageStreaming = async (messages: UiMessage[]) => {
    const payload: ChatApiInput = {
      apiKey: apiKey,
      model: chatModelId,
      messages: messages.map(({ role, text }) => ({
        role: role,
        content: text,
      })),
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      const newBotMessage: UiMessage = createUiMessage('assistant', '')

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const messageText = decoder.decode(value)
        newBotMessage.text += messageText

        // there may be a JSON object at the beginning of the message, which contains the model name (streaming workaround)
        if (!newBotMessage.model && newBotMessage.text.startsWith('{')) {
          const endOfJson = newBotMessage.text.indexOf('}')
          if (endOfJson > 0) {
            const json = newBotMessage.text.substring(0, endOfJson + 1)
            try {
              const parsed = JSON.parse(json)
              newBotMessage.model = parsed.model
              newBotMessage.text = newBotMessage.text.substring(endOfJson + 1)
            } catch (e) {
              // error parsing JSON, ignore
              console.log('Error parsing JSON: ' + e)
            }
          }
        }

        setMessages((list) => {
          // if missing, add the message at the end of the list, otherwise set a new list anyway, to trigger a re-render
          const message = list.find((message) => message.uid === newBotMessage.uid)
          return !message ? [...list, newBotMessage] : [...list]
        })
      }
    }
  }

  const handleComposerSendMessage: (text: string) => void = (text) => {
    // seed the conversation with a 'system' message
    const conversation = [...messages]
    if (!conversation.length) {
      const systemMessage = SystemPurposes[systemPurposeId].systemMessage.replaceAll(
        '{{Today}}',
        new Date().toISOString().split('T')[0] || ''
      )
      conversation.push(createUiMessage('system', systemMessage))
    }

    // add the user message
    conversation.push(createUiMessage('user', text))

    // update the list of messages
    setMessages(conversation)

    // disable the composer while the bot is replying
    setDisableCompose(true)
    getBotMessageStreaming(conversation).then(() => setDisableCompose(false))
  }

  const noMessages = !messages.length

  return (
    <main>
      <div className="flex min-h-screen flex-col">
        {/* Application Bar */}
        <div className="sticky top-0 z-20  flex items-center justify-between gap-4 border-b bg-gray-100 p-2">
          <Button icon={BackspaceIcon} aria-label="Clear Messages" data-balloon-pos="right" />
          <div className="font-mono text-sm">
            <NoSSR>
              Model: {GptChatModels[chatModelId]?.title || 'Select Model'}{' '}
              <span style={{ opacity: 0.5 }}> ·</span> Preset:{' '}
              {SystemPurposes[systemPurposeId].title}
            </NoSSR>
          </div>

          <Button variant="light" icon={CogIcon} onClick={() => setSettingsOpen(true)} />
        </div>

        {/* Chat */}
        <div className="relative flex-grow bg-mauve">
          {noMessages ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <h3 className="mb-2 text-xl font-medium tracking-tight">Choose a Preset</h3>
              <NoSSR>
                <Select
                  className="min-w-[40vw]"
                  value={systemPurposeId}
                  onChange={(e) => handlePurposeChange(e.currentTarget.value as SystemPurposeId)}
                >
                  {Object.keys(SystemPurposes).map((spId) => (
                    <option key={spId} value={spId}>
                      {SystemPurposes[spId as SystemPurposeId]?.title}
                    </option>
                  ))}
                </Select>
                <div className="mt-2 text-sm text-gray">
                  {SystemPurposes[systemPurposeId].description}
                </div>
              </NoSSR>
            </div>
          ) : (
            <ul>
              {messages.map((message) => (
                <Message
                  key={'msg-' + message.uid}
                  uiMessage={message}
                  onDelete={() => handleListDelete(message.uid)}
                  onEdit={(newText) => handleListEdit(message.uid, newText)}
                  onRunAgain={() => handleListRunAgain(message.uid)}
                />
              ))}
              <div ref={messagesEndRef}></div>
            </ul>
          )}
        </div>

        {/* Compose */}
        <div className="sticky bottom-0 z-10 border-t bg-gray-100 p-2">
          <NoSSR>
            <Composer
              isDeveloper={systemPurposeId === 'Developer'}
              disableSend={disableCompose}
              sendMessage={handleComposerSendMessage}
            />
          </NoSSR>
        </div>
      </div>

      {/* Settings Modal */}
      <Settings isOpen={settingsOpen} setIsOpen={setSettingsOpen} />
    </main>
  )
}
