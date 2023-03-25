import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { classed, ComponentProps } from '@tw-classed/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

const DropdownContent = classed(motion.div, 'border rounded-md bg-white px-1 py-1 shadow-flat')

interface Props extends ComponentProps<typeof RadixDropdown.Content> {
  trigger: ReactNode
  children?: ReactNode
}

export const Dropdown = ({ trigger, children, ...contentProps }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <RadixDropdown.Root open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
        <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

        <AnimatePresence>
          {isOpen && (
            <RadixDropdown.Portal forceMount>
              <RadixDropdown.Content
                asChild
                forceMount
                align="start"
                sideOffset={8}
                className="z-50"
                {...contentProps}
              >
                <DropdownContent
                  initial={{ y: 3, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 3, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </DropdownContent>
              </RadixDropdown.Content>
            </RadixDropdown.Portal>
          )}
        </AnimatePresence>
      </RadixDropdown.Root>
    </>
  )
}
