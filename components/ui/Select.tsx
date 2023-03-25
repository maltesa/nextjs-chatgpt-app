import { classed } from '@tw-classed/react'

export const Select = classed(
  'select',
  {
    variants: {
      size: {
        sm: 'pr-6 text-sm',
        md: 'pr-8 text-base',
        lg: 'pr-10 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
  'border-gray-200 bg-white text-black rounded-md transition-colors',
  'active:bg-gray-50',
  'focus:ring-primary focus:border-primary'
)
