import { Item } from '@radix-ui/react-dropdown-menu'
import { classed, ComponentProps } from '@tw-classed/react'
import type { ReactNode, SVGProps } from 'react'

const DropdownItemWrapper = classed(
  Item,
  'flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none',
  'text-gray-700 focus:bg-gray-100'
)

interface Props extends ComponentProps<typeof DropdownItemWrapper> {
  icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element
  shortcut?: string
  children: ReactNode
}

export const DropdownItem = ({ icon: Icon, shortcut, children, ...props }: Props) => {
  return (
    <DropdownItemWrapper {...props}>
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      <span className="flex-grow">{children}</span>
      {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
    </DropdownItemWrapper>
  )
}
