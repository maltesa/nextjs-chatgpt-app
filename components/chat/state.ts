import { atomWithStorage } from 'jotai/utils'

import { UiMessage } from '@/components/chat/Messages'
import { atom } from 'jotai'
import { GptChatModelId, systemPromptTemplates } from './constants'

interface Settings {
  apiKey?: string
  chatModelId: GptChatModelId
  systemPrompt: string
}

export const settingsAtom = atomWithStorage<Settings>('settings', {
  apiKey: undefined,
  chatModelId: 'gpt-4',
  systemPrompt: systemPromptTemplates['tutor'].message,
})

export const showSettingsAtom = atom<boolean>(false)

export const uiMessagesAtom = atom<UiMessage[]>([])

export const answerInProgressAtom = atom(false)
