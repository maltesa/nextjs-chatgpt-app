import type { HTMLProps } from 'react'

interface Props extends HTMLProps<HTMLSpanElement> {
  label?: string
}

export function Emoji({ label, ...spanProps }: Props) {
  return <span role="img" aria-label={label} aria-hidden={!!label} {...spanProps} />
}
