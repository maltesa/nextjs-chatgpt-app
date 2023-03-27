import { ApplicationBar, Composer, Messages, SettingsDialog } from '@/components/chat'

export default function Chat() {
  return (
    <main>
      <div className="flex min-h-screen flex-col">
        {/* Application Bar */}
        <ApplicationBar />

        {/* Chat */}
        <Messages />

        {/* Compose */}
        <Composer />
      </div>

      <SettingsDialog />
    </main>
  )
}
