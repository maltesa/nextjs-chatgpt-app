import * as React from 'react'
import { shallow } from 'zustand/shallow'

import { Button, Dialog, DialogContent, DialogTitle, Input, Label, Select } from '@/components/ui'
import clsx from 'clsx'
import { GptChatModelId, GptChatModels, useSettingsStore } from '../lib/store'
import { NoSSR } from './util/NoSSR'

export const isValidOpenAIApiKey = (apiKey?: string) =>
  !!apiKey && apiKey.startsWith('sk-') && apiKey.length > 40

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

/**
 * Component that allows the User to modify the application settings,
 * persisted on the client via localStorage.
 */
export function Settings({ isOpen, setIsOpen }: Props) {
  const { apiKey, setApiKey, chatModelId, setChatModelId } = useSettingsStore(
    (state) => ({
      apiKey: state.apiKey,
      setApiKey: state.setApiKey,
      chatModelId: state.chatModelId,
      setChatModelId: state.setChatModelId,
    }),
    shallow
  )

  const handleApiKeyChange = (e: React.ChangeEvent) =>
    setApiKey((e.target as HTMLInputElement).value)

  const handleGptModelChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setChatModelId((e.currentTarget.value || 'gpt-4') as GptChatModelId)
  }

  const handleApiKeyDown = (e: React.KeyboardEvent) => e.key === 'Enter' && setIsOpen(false)

  const needsApiKey = !!process.env.REQUIRE_USER_API_KEYS
  const isValidKey = isValidOpenAIApiKey(apiKey)

  return (
    <Dialog showClose isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>

        {/* Api-Key */}
        <div className="mb-4 space-y-1">
          <Label className="flex">
            Enter your OpenAI API Key {needsApiKey ? '(required)' : '(not required)'}
          </Label>

          <Input
            placeholder={'sk-...'}
            className={clsx('w-full', needsApiKey && !isValidKey && 'ring-red')}
            value={apiKey}
            onChange={handleApiKeyChange}
            onKeyDown={handleApiKeyDown}
          />
        </div>

        {/* Model */}
        <div className="mb-4">
          {!needsApiKey && <span>This box lets you override the default API key</span>}
          <Label>Select Model</Label>

          <NoSSR>
            <Select className="w-full" value={chatModelId} onChange={handleGptModelChange}>
              <option value={'gpt-4'}>GPT-4</option>
              <option value={'gpt-3.5-turbo'}>GPT-3.5 Turbo</option>
              {/*<Option value={'gpt-4-32k'}>GPT-4-32k (not out yet)</Option>*/}
            </Select>

            <span className="text-sm text-gray">
              {chatModelId in GptChatModels && GptChatModels[chatModelId].description}
            </span>
          </NoSSR>
        </div>
        {/* Submit */}
        <div className="text-right">
          <Button variant={isValidKey ? 'primary' : 'light'} onClick={() => setIsOpen(false)}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
