import update from 'immutability-helper'
import { useAtom } from 'jotai'
import { ChangeEventHandler, HTMLProps, useCallback } from 'react'

import { Textarea } from '@/components/ui'

import { settingsAtom } from '../state'

export function SystemPrompt(props: HTMLProps<HTMLDivElement>) {
  const [{ systemPrompt }, setSettings] = useAtom(settingsAtom)

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      setSettings((s) => update(s, { systemPrompt: { $set: e.currentTarget.value } }))
    },
    [setSettings]
  )

  return (
    <div {...props}>
      <h3 className="mb-2 text-xl font-medium tracking-tight">System Message</h3>
      <Textarea className="w-full" value={systemPrompt} onChange={handleChange} />
    </div>
  )
}
