import { classed } from '@tw-classed/react'

export const Input = classed('input', 'border-0 placeholder-gray-300 text-black outline-none', {
  variants: {
    variant: {
      default:
        'bg-white rounded-md ring-gray-200 ring-1 ring-inset focus:ring-primary focus:ring-2',
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
})
