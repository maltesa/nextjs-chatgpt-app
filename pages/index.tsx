import { ApplicationBar, Composer, Messages, SettingsDialog } from '@/components/chat'
import Head from 'next/head'

export default function Chat() {
  return (
    <>
      <Head>
        <title>SHchat-GPT</title>
      </Head>
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
    </>
  )
}
