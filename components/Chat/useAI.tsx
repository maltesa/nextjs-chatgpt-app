import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { ChatApiInput } from 'pages/api/chat'

import { UiMessage, createUiMessage } from './Messages'
import { answerInProgressAtom, settingsAtom, uiMessagesAtom } from './state'

/**
 * This hook returns a function that takes an array of previous UiMessages and starts streaming
 * the AIAssistants reply (based on the previous messages) as soon as its called.
 */
export function useAi() {
  const { apiKey, chatModelId: model, systemPrompt } = useAtomValue(settingsAtom)
  const [answerInProgress, setAnswerInProgress] = useAtom(answerInProgressAtom)
  const setUiMessages = useSetAtom(uiMessagesAtom)

  const askAI = useCallback(
    async (uiMessages: UiMessage[]) => {
      if (answerInProgress) return

      const payload: ChatApiInput = {
        apiKey,
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...uiMessages.map(({ role, text }) => ({ role: role, content: text })),
        ],
      }

      try {
        setAnswerInProgress(true)
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

            setUiMessages((uiMessages) => {
              // if missing, add the message at the end of the uiMessages, otherwise set a new uiMessages anyway, to trigger a re-render
              const message = uiMessages.find((message) => message.uid === newBotMessage.uid)
              return !message ? [...uiMessages, newBotMessage] : [...uiMessages]
            })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setAnswerInProgress(false)
      }
    },
    [apiKey, model, setUiMessages, answerInProgress, setAnswerInProgress]
  )

  return { askAI, answerInProgress }
}
