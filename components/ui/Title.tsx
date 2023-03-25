import { classed } from '@tw-classed/react'

const BaseTitle = classed('h1', {
  variants: {
    size: {
      h1: 'text-gray-800 font-extrabold text-5xl tracking-tighter mt-12 mb-6',
      h2: 'text-gray-600 font-bold text-3xl tracking-tighter mt-8 mb-4',
      h3: 'text-gray font-bold text-2xl tracking-tighter mt-6 mb-2',
    },
  },
  defaultVariants: {
    size: 'h1',
  },
})

export function Title(props: React.ComponentProps<typeof BaseTitle>) {
  const tag = props.as || props.size || 'h1'

  return <BaseTitle {...props} as={tag} />
}
