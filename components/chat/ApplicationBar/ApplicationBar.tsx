import { BackspaceIcon, CogIcon } from '@heroicons/react/24/solid'
import { useAtomValue, useSetAtom } from 'jotai'

import { Button } from '@/components/ui'

import { modelCards } from '../constants'
import { settingsAtom, showSettingsAtom } from '../state'

export function ApplicationBar() {
  const setSettingsOpen = useSetAtom(showSettingsAtom)
  const { chatModelId } = useAtomValue(settingsAtom)

  return (
    <div className="sticky top-0 z-20  flex items-center justify-between gap-4 border-b bg-gray-100 p-2">
      <Button
        icon={BackspaceIcon}
        aria-label="Clear Messages"
        data-balloon-pos="right"
        // onClick={() => setMessages([])}
      />
      <div className="font-mono text-sm">
        Model: {modelCards[chatModelId]?.title || 'Select Model'}{' '}
      </div>

      <Button variant="light" icon={CogIcon} onClick={() => setSettingsOpen(true)} />
    </div>
  )
}
