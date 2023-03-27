import Prism from 'prismjs'

import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-typescript'
import 'prismjs/themes/prism.css'

import { MessageBlock } from './types'

export function parseMessage(text: string): MessageBlock[] {
  const codeBlockRegex = /`{3,}([\w\\.]+)?\n([\s\S]*?)(`{3,}|$)/g
  const result: MessageBlock[] = []

  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const markdownLanguage = (match[1] || '').trim()
    const code = match[2]?.trim() || ''
    const blockEnd = match[3] || ''

    // Load the specified language if it's not loaded yet
    // NOTE: this is commented out because it inflates the size of the bundle by 200k
    // if (!Prism.languages[language]) {
    //   try {
    //     require(`prismjs/components/prism-${language}`);
    //   } catch (e) {
    //     console.warn(`Prism language '${language}' not found, falling back to 'typescript'`);
    //   }
    // }

    const codeLanguage = inferLanguage(markdownLanguage, code)
    const highlightLanguage = codeLanguage || 'typescript'
    const highlightedCode = Prism.highlight(
      code,
      Prism.languages[highlightLanguage] || Prism.languages.typescript!,
      highlightLanguage
    )

    result.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    result.push({
      type: 'code',
      content: highlightedCode,
      language: codeLanguage,
      complete: blockEnd.startsWith('```'),
      code,
    })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    result.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return result
}

const inferLanguage = (markdownLanguage: string, code: string): string | null => {
  // we have an hint
  if (markdownLanguage) {
    // no dot: it's a syntax-highlight language
    if (!markdownLanguage.includes('.')) return markdownLanguage

    // dot: there's probably an extension
    const extension = markdownLanguage.split('.').pop()
    if (extension) {
      const languageMap: { [key: string]: string } = {
        cs: 'csharp',
        html: 'html',
        java: 'java',
        js: 'javascript',
        json: 'json',
        jsx: 'javascript',
        md: 'markdown',
        py: 'python',
        sh: 'bash',
        ts: 'typescript',
        tsx: 'typescript',
        xml: 'xml',
      }
      const language = languageMap[extension]
      if (language) return language
    }
  }

  // based on how the code starts, return the language
  if (code.startsWith('<DOCTYPE html') || code.startsWith('<!DOCTYPE')) return 'html'
  if (code.startsWith('<')) return 'xml'
  if (code.startsWith('from ')) return 'python'
  if (code.startsWith('import ') || code.startsWith('export ')) return 'typescript' // or python
  if (code.startsWith('interface ') || code.startsWith('function ')) return 'typescript' // ambiguous
  if (code.startsWith('package ')) return 'java'
  if (code.startsWith('using ')) return 'csharp'
  return null
}
