import { HTMLProps, useState } from 'react'

import { Textarea } from '@/components/ui'

import { systemPromptTemplates } from '../constants'

export function SystemPrompt(props: HTMLProps<HTMLDivElement>) {
  const [systemMessage, setSystemMessage] = useState(systemPromptTemplates.tutor['message'])

  return (
    <div {...props}>
      <h3 className="mb-2 text-xl font-medium tracking-tight">Adjust System Message</h3>
      <Textarea
        className="w-full"
        value={systemMessage}
        onChange={(e) => setSystemMessage(e.currentTarget.value)}
      />
    </div>
  )
}
