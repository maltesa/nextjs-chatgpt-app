import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { classed, ComponentProps } from '@tw-classed/react'

import { DropdownItem } from '@/components/ui/Dropdown/DropdownItem'

import { Button } from './Button'
import { Dropdown } from './Dropdown'

const Wrapper = classed('div', 'inline-flex')
const DropdownButtonLeft = classed(Button, 'rounded-r-none', {
  variants: {
    padSize: {
      sm: 'pr-4',
      md: 'pr-6',
      lg: 'pr-6',
    },
  },
})
const DropdownButtonRight = classed(Button, 'rounded-l-none -ml-0.5 !px-2')

interface Props extends Omit<ComponentProps<typeof Button>, 'as'> {
  content: string
}

export function DropdownButton({ content, children, className, loading, ...btnProps }: Props) {
  return (
    <Wrapper className={className}>
      <DropdownButtonLeft {...btnProps} loading={loading} padSize={btnProps.size}>
        {content}
      </DropdownButtonLeft>
      <Dropdown
        align="end"
        trigger={
          <DropdownButtonRight {...btnProps} icon={ChevronDownIcon} disabled={loading as boolean} />
        }
      >
        {children}
      </Dropdown>
    </Wrapper>
  )
}

export const DropdownButtonItem = DropdownItem
