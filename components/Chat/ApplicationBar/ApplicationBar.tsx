import { BackspaceIcon, CogIcon } from '@heroicons/react/24/solid'
import { classed } from '@tw-classed/react'
import { useAtomValue, useSetAtom } from 'jotai'

import { IconButton } from '@/components/ui'

import { modelCards } from '../constants'
import { settingsAtom, showSettingsAtom, uiMessagesAtom } from '../state'

const Bar = classed(
  'div',
  'sticky top-0 z-20  flex items-center justify-between gap-4 bg-primary p-2 text-white ring-4 ring-primary/25'
)

export function ApplicationBar() {
  const setSettingsOpen = useSetAtom(showSettingsAtom)
  const { chatModelId } = useAtomValue(settingsAtom)
  const setUiMessages = useSetAtom(uiMessagesAtom)

  return (
    <Bar>
      <IconButton
        aria-label="Clear Messages"
        className="text-white "
        data-balloon-pos="right"
        icon={BackspaceIcon}
        size="lg"
        variant="light"
        onClick={() => setUiMessages([])}
      />

      <div className="font-mono text-sm">
        Model: {modelCards[chatModelId]?.title || 'Select Model'}{' '}
      </div>

      <IconButton
        aria-label="Settings"
        className="text-white "
        data-balloon-pos="left"
        icon={CogIcon}
        size="lg"
        variant="light"
        onClick={() => setSettingsOpen(true)}
      />
    </Bar>
  )
}
