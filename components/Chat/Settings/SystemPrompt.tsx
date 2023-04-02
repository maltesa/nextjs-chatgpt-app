import update from 'immutability-helper'
import { useAtom } from 'jotai'
import { HTMLProps, useCallback } from 'react'

import { Label, Select, Textarea } from '@/components/ui'

import { systemPromptTemplates } from '@/components/Chat/constants'
import { settingsAtom } from '../state'

export function SystemPrompt(props: HTMLProps<HTMLDivElement>) {
  const [{ systemPrompt }, setSettings] = useAtom(settingsAtom)

  const updatePrompt = useCallback(
    (prompt: string) => {
      if (prompt === 'none') return

      setSettings((s) => update(s, { systemPrompt: { $set: prompt } }))
    },
    [setSettings]
  )

  return (
    <div {...props}>
      <Label htmlFor="systemPrompt" className="mb-1 !text-xl font-medium">
        Enter a System Message
      </Label>

      <Textarea
        id="systemPrompt"
        className="mb-2 w-full"
        value={systemPrompt}
        onChange={(e) => updatePrompt(e.currentTarget.value)}
      />

      <Label htmlFor="promptTemplate" className="mb-1">
        Or
      </Label>
      <Select
        id="promptTemplate"
        className="w-full"
        onChange={(e) => updatePrompt(e.currentTarget.value)}
      >
        <option value="none">Pick a Template</option>
        {(Object.keys(systemPromptTemplates) as (keyof typeof systemPromptTemplates)[]).map(
          (key) => {
            const { title, description, message } = systemPromptTemplates[key]
            return (
              <option key={key} value={message}>
                {title} - {description}
              </option>
            )
          }
        )}
      </Select>
    </div>
  )
}
