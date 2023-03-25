import { classed } from '@tw-classed/react'

export const Badge = classed(
  'div',
  'border inline-block flex-none rounded-full py-0.5 px-2 text-xs',
  'bg-white',
  {
    variants: {
      variant: {
        primary: 'border-primary text-primary-600',
        light: 'text-gray-600',
      },
    },
    defaultVariants: {
      variant: 'light',
    },
  }
)
