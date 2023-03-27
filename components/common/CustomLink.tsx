import Link from 'next/link'
import type { ComponentProps } from 'react'

export const CustomLink = ({ href, children, ...rest }: ComponentProps<typeof Link>) => {
  // Is internal Link
  if (typeof href === 'object' || (href && href.startsWith('/'))) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  }

  // Is anchor Link?
  if (typeof href === 'object' || (href && href.startsWith('#'))) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>
      {children}
    </a>
  )
}
