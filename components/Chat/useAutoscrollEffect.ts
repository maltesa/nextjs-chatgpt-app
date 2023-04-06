import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

import { uiMessagesAtom } from '@/components/Chat/state'

function getMaxYScrollPos() {
  return document.documentElement.scrollHeight - document.documentElement.clientHeight
}

/**
 * Automatically scroll to
 */
export function useAutoscrollEffect() {
  const [autoscroll, setAutoscroll] = useState(true)
  const uiMessages = useAtomValue(uiMessagesAtom)

  useEffect(() => {
    const enableAutoscrollOnBottom = () => {
      const maxYScrollPos = getMaxYScrollPos()
      if (maxYScrollPos <= 0) return

      // Enable if we are near the page end
      if (window.scrollY > maxYScrollPos - 25) setAutoscroll(true)
      // disable otherwise (let the user scroll)
      else setAutoscroll(false)
    }

    addEventListener('scroll', enableAutoscrollOnBottom)
    return () => removeEventListener('scroll', enableAutoscrollOnBottom)
  }, [])

  console.log(autoscroll)

  useEffect(() => {
    if (autoscroll) window.scrollTo(0, document.body.scrollHeight)
  }, [autoscroll, uiMessages])
}
