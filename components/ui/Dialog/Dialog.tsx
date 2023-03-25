import { XMarkIcon } from '@heroicons/react/24/solid'
import * as RadixDialog from '@radix-ui/react-dialog'
import { classed } from '@tw-classed/react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ComponentProps } from 'react'

const DialogOverlay = classed(
  motion.div,
  'fixed inset-0 z-40 bg-black bg-opacity-75 backdrop-blur-md supports-backdrop-filter:bg-opacity-50'
)

const DialogInner = classed(
  RadixDialog.Content,
  'fixed z-50 w-full grid',
  'bottom-0 left-1/2 -translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:bottom-auto',
  {
    variants: {
      size: {
        sm: 'max-w-lg',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const DialogCloseButton = classed(
  RadixDialog.Close,
  'inline-flex items-center justify-center rounded-full p-1 mb-2 justify-self-end',
  'focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75'
)

const CloseIcon = classed(XMarkIcon, 'h-6 w-6 text-white hover:text-gray-200')

interface Props extends Omit<ComponentProps<typeof DialogInner>, 'children'> {
  isOpen: boolean
  onOpenChange?: (open: boolean) => void
  showClose?: boolean
  children: React.ReactNode
}

export function Dialog({
  isOpen,
  showClose,
  onOpenChange,
  children,
  className,
  ...contentProps
}: Props) {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay forceMount>
              <DialogOverlay
                key="dialog-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </RadixDialog.Overlay>
            <DialogInner {...contentProps} key="dialog-inner" forceMount>
              {showClose && (
                <DialogCloseButton asChild>
                  <motion.button
                    key="dialog-close-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <CloseIcon />
                  </motion.button>
                </DialogCloseButton>
              )}
              <motion.div
                key="dialog-content-wrapper"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={className}
              >
                {children}
              </motion.div>
            </DialogInner>
          </RadixDialog.Portal>
        ) : null}
      </AnimatePresence>
    </RadixDialog.Root>
  )
}
