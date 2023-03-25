import { classed } from '@tw-classed/react'
import type { ComponentProps } from 'react'

const BasicCheckbox = classed(
  'input',
  'transition-colors bg-white text-primary border-0 ring-gray-200 ring-1 ring-inset rounded-md',
  'focus:ring-primary focus:ring-2',
  {
    variants: {
      size: {
        sm: 'w-5 h-5',
        md: 'w-7 h-7',
        lg: 'w-10 h-10',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export const Checkbox = (props: ComponentProps<typeof BasicCheckbox>) => (
  <BasicCheckbox type="checkbox" {...props} />
)
