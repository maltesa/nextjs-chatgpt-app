import type { UiMessage } from '.'

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

export const createUiMessage = (role: UiMessage['role'], text: string): UiMessage => ({
  uid: Math.random().toString(36).substring(2, 15),
  text: text,
  model: '',
  ...MessageDefaults[role],
})
