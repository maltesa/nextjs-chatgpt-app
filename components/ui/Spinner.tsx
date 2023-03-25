import { classed } from '@tw-classed/react'

import { SpinnerIcon } from './CustomIcons'

export const Spinner = classed(SpinnerIcon, 'animate-spin', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
