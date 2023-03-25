import { classed, ComponentProps } from '@tw-classed/react'
import { AnimatePresence, motion } from 'framer-motion'

const BackdropInner = classed(
  motion.div,
  'absolute inset-0 overflow-auto z-10',
  'backdrop-blur-lg supports-backdrop-filter:bg-opacity-70',
  {
    variants: {
      variant: {
        light: 'bg-mauve',
        gray: 'bg-gray-200',
      },
    },
    defaultVariants: {
      variant: 'gray',
    },
  }
)

interface Props extends ComponentProps<typeof BackdropInner> {
  visible: boolean
  children?: React.ReactNode
}

export const Backdrop = ({ visible, ...innerProps }: Props) => (
  <AnimatePresence>
    {visible && (
      <BackdropInner
        {...innerProps}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    )}
  </AnimatePresence>
)
