import { classed } from '@tw-classed/react'

export const Input = classed(
  'input',
  'border-0 placeholder-gray-300 text-black dark:text-gray-100 outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-gray-900 rounded-md ring-gray-200 dark:ring-gray-700 ring-1 ring-inset focus:ring-primary focus:ring-2',
        basic: 'bg-transparent ring-0 focus:ring-0',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-4 py-3 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)
