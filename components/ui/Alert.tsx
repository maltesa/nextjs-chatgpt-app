import { classed, ComponentProps } from '@tw-classed/react'
import { MutableRefObject, useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { XMarkIcon } from '@heroicons/react/24/solid'

const AlertFrame = classed('div', 'relative rounded-md border px-6 py-4', {
  variants: {
    variant: {
      light: 'bg-white text-gray-900',
      success: 'border-green-100 bg-green-50 text-green-900',
      warning: 'border-yellow-100 bg-yellow-50 text-yellow-900',
      danger: 'border-red-200 bg-red-100 text-red-900',
    },
  },
  defaultVariants: {
    variant: 'light',
  },
})

interface Props extends Omit<ComponentProps<typeof AlertFrame>, 'title'> {
  title?: string | React.ReactNode
  showClose?: boolean
  closeRef?: MutableRefObject<(() => void) | undefined>
}
export function Alert({ showClose = false, title, closeRef, children, ...frameProps }: Props) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (closeRef) closeRef.current = () => setIsOpen(false)
  }, [closeRef])

  return (
    <Reveal isOpen={isOpen}>
      <AlertFrame {...frameProps}>
        {showClose ? (
          <Button
            variant="basic"
            icon={XMarkIcon}
            className="!absolute right-4 top-4 rounded-full"
            onClick={() => setIsOpen(false)}
          />
        ) : null}
        {title && <h3 className="mb-2 text-xl font-bold">{title}</h3>}
        {children}
      </AlertFrame>
    </Reveal>
  )
}
