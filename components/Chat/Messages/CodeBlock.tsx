import { Sandpack, SandpackFiles } from '@codesandbox/sandpack-react'
import { ClipboardDocumentIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid'
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
    <div className="group relative block rounded-md border border-transparent bg-gray-700 p-2 font-medium text-primary-400 dark:border-gray-600">
      <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          icon={ClipboardDocumentIcon}
          variant="basic"
          size="sm"
          onClick={handleCopyToClipboard}
        />
        {showRunIcon && (
          <Button
            icon={showSandpack ? StopIcon : PlayIcon}
            variant="basic"
            size="sm"
            onClick={handleToggleSandpack}
          />
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: codeBlock.content }} className="font-mono" />
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
