import { Sandpack, SandpackFiles } from '@codesandbox/sandpack-react'
import { ClipboardIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

import { Button } from '@/components/ui'
import { copyToClipboard } from '@/lib/utils'

import type { CodeMessageBlock } from './types'

type SandpackConfig = { files: SandpackFiles; template: 'vanilla-ts' | 'vanilla' }
const runnableLanguages = ['html', 'javascript', 'typescript']

export function CodeBlock({ codeBlock }: { codeBlock: CodeMessageBlock }) {
  const [showSandpack, setShowSandpack] = useState(false)
  const handleCopyToClipboard = () => copyToClipboard(codeBlock.code)
  const handleToggleSandpack = () => setShowSandpack(!showSandpack)

  const showRunIcon =
    codeBlock.complete && !!codeBlock.language && runnableLanguages.includes(codeBlock.language)

  return (
    <div className="group relative block bg-gray-100 p-1.5 font-medium">
      <Button
        variant="primary"
        icon={ClipboardIcon}
        className="absolute top-0 right-0 z-10 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={handleCopyToClipboard}
      />
      {showRunIcon && (
        <Button
          variant="light"
          onClick={handleToggleSandpack}
          className="right-50 absolute top-0 z-10 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {showSandpack ? <StopIcon /> : <PlayIcon />}
        </Button>
      )}
      <div dangerouslySetInnerHTML={{ __html: codeBlock.content }} />
      {showRunIcon && showSandpack && <RunnableCode codeBlock={codeBlock} />}
    </div>
  )
}

function RunnableCode({ codeBlock }: { codeBlock: CodeMessageBlock }): JSX.Element | null {
  let config: SandpackConfig
  switch (codeBlock.language) {
    case 'html':
      config = {
        template: 'vanilla',
        files: { '/index.html': codeBlock.code, '/index.js': '' },
      }
      break
    case 'javascript':
    case 'typescript':
      config = {
        template: 'vanilla-ts',
        files: { '/index.ts': codeBlock.code },
      }
      break
    default:
      return null
  }
  return (
    <Sandpack
      {...config}
      theme="auto"
      options={{ showConsole: true, showConsoleButton: true, showTabs: true, showNavigator: false }}
    />
  )
}
