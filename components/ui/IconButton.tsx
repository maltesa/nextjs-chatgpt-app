import { classed } from '@tw-classed/react'

import { Button } from './Button'

export const IconButton = classed(Button, '!p-1 ring-transparent !bg-transparent', {
  variants: {
    variant: {
      light: 'hover:text-gray-100 active:text-gray-200 focus-visible:outline-gray-300',
      primary: 'hover:text-primary active:text-primary-600 focus-visible:outline-primary',
      danger: 'hover:text-red active:text-red-600 focus-visible:outline-red',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})
