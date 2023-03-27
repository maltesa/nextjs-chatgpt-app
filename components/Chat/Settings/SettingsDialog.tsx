import { useAtom } from 'jotai'

import { Button, Dialog, DialogContent, DialogTitle, Input, Label, Select } from '@/components/ui'
import { useForm } from '@/lib/utils'

import { useEffect } from 'react'
import { GptChatModelId, modelCards } from '../constants'
import { settingsAtom, showSettingsAtom } from '../state'

interface Props {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

/**
 * Component that allows the User to modify the application settings,
 * persisted on the client via localStorage.
 */
export function SettingsDialog() {
  const [isOpen, setIsOpen] = useAtom(showSettingsAtom)
  const [{ chatModelId, apiKey }, setSettings] = useAtom(settingsAtom)
  const form = useForm('apiKey', 'chatModelId')

  const handleSubmit = form(({ apiKey, chatModelId }) => {
    setSettings((p) => ({ ...p, apiKey, chatModelId: chatModelId as GptChatModelId }))
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
            <Label className="flex">Enter your OpenAI API Key</Label>

            <Input name="apiKey" placeholder={'sk-...'} className="w-full" defaultValue={apiKey} />
          </div>

          {/* Model */}
          <div className="mb-4">
            <Label>Select Model</Label>

            <Select name="chatModelId" className="w-full" defaultValue={chatModelId}>
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

          {/* Submit */}
          <div className="text-right">
            <Button variant="primary">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
