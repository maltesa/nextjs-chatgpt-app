import { classed } from '@tw-classed/react'

export const Avatar = classed(
  'button',
  'h-8 w-8 flex-none rounded-full text-sm',
  'outline-primary outline-offset-2',
  {
    variants: {
      variant: {
        text: 'font-mono inline-flex items-center justify-center text-lg font-medium uppercase',
      },
      color: {
        primary: 'bg-primary text-white',
        light: 'bg-gray-200 text-gray-700',
      },
    },
    defaultVariants: {
      variant: 'text',
      color: 'primary',
    },
  }
)
