import { classed, DerivedComponentType } from '@tw-classed/react'
import { ComponentProps, forwardRef } from 'react'

import { SpinnerIcon } from './CustomIcons'

const BasicButton = classed(
  'button',
  'inline-block relative transition-all duration-100 outline-none ring-1 rounded-md whitespace-nowrap outline-offset-1 focus-visible:outline-2',
  'ring-inset',
  'disabled:duration-500 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:shadow-none disabled:ring-0 disabled:hover:bg-gray-300 disabled:focus:bg-gray-300 disabled:active:bg-gray-300',
  {
    variants: {
      block: {
        true: 'w-full',
      },
      glow: {
        true: 'shadow-glow shadow-primary',
      },
      loading: {
        true: 'cursor-wait disabled:cursor-wait',
      },
      size: {
        sm: 'px-3 py-2 text-xs font-normal [&_svg]:w-4 [&_svg]:h-4',
        md: 'px-4 py-2.5 text-sm font-medium [&_svg]:w-5 [&_svg]:h-5',
        lg: 'px-5 py-3.5 text-base font-medium tracking-tight [&_svg]:w-6 [&_svg]:h-6',
      },
      variant: {
        basic: '!p-1 ring-transparent focus-visible:outline-primary',
        light:
          'bg-white ring-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-primary',
        primary:
          'bg-primary ring-transparent text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:outline-primary',
        danger:
          'bg-red ring-transparent text-white hover:bg-red-600 active:bg-red-700 focus-visible:outline-red',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'light',
    },
  }
)

const LoadingContainer = classed('div', 'absolute inset-0 flex items-center justify-center')
const ButtonContent = classed('div', 'flex items-center justify-center', {
  variants: {
    loading: { true: 'opacity-0', false: 'opacity-100' },
    size: { sm: 'gap-1', md: 'gap-1.5', lg: 'gap-2' },
  },
  defaultVariants: {
    size: 'md',
  },
})
interface Props extends Omit<ComponentProps<typeof BasicButton>, 'icon'> {
  icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, disabled, icon: Icon, loading, size, ...props },
  ref
) {
  return (
    <BasicButton
      {...props}
      disabled={disabled || loading === true || loading === 'true'}
      loading={loading}
      size={size}
      ref={ref}
    >
      {loading ? (
        <LoadingContainer>
          <SpinnerIcon className="animate-spin" />
        </LoadingContainer>
      ) : null}
      <ButtonContent loading={loading} size={size}>
        {Icon ? <Icon /> : null}
        {children}
      </ButtonContent>
    </BasicButton>
  )
}) as DerivedComponentType<typeof BasicButton, Props>
