import { useAtomValue } from 'jotai'

import { ApplicationBar } from './ApplicationBar'
import { Composer } from './Composer'
import { Messages } from './Messages'
import { SettingsDialog, SystemPrompt } from './Settings'
import { noMessagesAtom } from './state'

export function Chat() {
  const noMessages = useAtomValue(noMessagesAtom)

  return (
    <div className="relative flex-grow bg-mauve">
      <div className="flex min-h-screen flex-col">
        {/* Application Bar */}
        <ApplicationBar />

        {/* Chat */}
        <div className="relative flex-grow">
          {noMessages ? (
            <SystemPrompt className="absolute top-1/2 left-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <Messages />
          )}
        </div>

        {/* TextInput */}
        <Composer />
      </div>

      <SettingsDialog />
    </div>
  )
}
