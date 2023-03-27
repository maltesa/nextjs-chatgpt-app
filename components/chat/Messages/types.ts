export interface UiMessage {
  uid: string
  sender: 'You' | 'Bot' | string
  role: 'assistant' | 'system' | 'user'
  text: string
  model: string // optional for 'assistant' roles (not user messages)
  avatar: string | React.ElementType | null
}

export type MessageBlock = { type: 'text'; content: string } | CodeMessageBlock

export type CodeMessageBlock = {
  type: 'code'
  content: string
  language: string | null
  complete: boolean
  code: string
}
