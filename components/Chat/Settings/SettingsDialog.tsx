import { useAtom } from 'jotai'
import { useEffect } from 'react'

import { Button, Dialog, DialogContent, DialogTitle, Input, Label, Select } from '@/components/ui'
import { useForm } from '@/lib/utils'

import { GptChatModelId, modelCards } from '../constants'
import { settingsAtom, showSettingsAtom } from '../state'

/**
 * Component that allows the User to modify the application settings,
 * persisted on the client via localStorage.
 */
export function SettingsDialog() {
  const [isOpen, setIsOpen] = useAtom(showSettingsAtom)
  const [{ chatModelId, apiKey, temperature }, setSettings] = useAtom(settingsAtom)
  const form = useForm('apiKey', 'chatModelId', 'temperature')

  const handleSubmit = form(({ apiKey, chatModelId, temperature }) => {
    setSettings((p) => ({
      ...p,
      apiKey,
      chatModelId: chatModelId as GptChatModelId,
      temperature: parseFloat(temperature),
    }))
    setIsOpen(false)
  })

  // show the settings at startup if the API key is not present
  useEffect(() => {
    setIsOpen(!apiKey)
  }, [apiKey, setIsOpen])

  return (
    <Dialog showClose isOpen={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>

        <form onSubmit={handleSubmit}>
          {/* Api-Key */}
          <div className="mb-4 space-y-1">
            <Label className="flex" htmlFor="apiKey">
              Enter your OpenAI API Key
            </Label>

            <Input
              id="apiKey"
              name="apiKey"
              placeholder={'sk-...'}
              className="w-full"
              defaultValue={apiKey}
            />
          </div>

          {/* Model */}
          <div className="mb-4">
            <Label htmlFor="modelId">Select Model</Label>

            <Select id="modelId" name="chatModelId" className="w-full" defaultValue={chatModelId}>
              {(Object.keys(modelCards) as (keyof typeof modelCards)[]).map((modelId) => {
                const { title, description } = modelCards[modelId]
                return (
                  <option key={modelId} value={modelId}>
                    {title} - {description}
                  </option>
                )
              })}
            </Select>
          </div>

          {/* Temperature */}
          <div className="mb-4">
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              name="temperature"
              type="range"
              className="w-full px-0 accent-primary !ring-transparent"
              min={0}
              max={1}
              step={0.01}
              defaultValue={temperature}
            />
          </div>

          {/* Submit */}
          <div className="text-right">
            <Button variant="primary">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
