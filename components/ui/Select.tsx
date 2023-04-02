import { classed } from '@tw-classed/react'

export const Select = classed(
  'select',
  'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-gray-100 rounded-md transition-colors',
  'active:bg-gray-50 dark:active:bg-gray-800',
  'focus:ring-primary focus:border-primary',
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
  }
)
