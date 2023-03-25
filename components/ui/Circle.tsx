import { classed } from '@tw-classed/react'

export const Circle = classed('div', 'inline-block rounded-full flex-none', {
  variants: {
    size: {
      sm: 'w-1.5 h-1.5',
    },
    color: {
      white: 'bg-white',
      primary: 'bg-primary',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'sm',
  },
})
