import * as React from 'react'
import { cn } from '@/lib/utils'

export function VisuallyHidden({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  // Tailwind's `sr-only` utility hides content visually but keeps it accessible to
  // screen readers. Expose className for small overrides if needed.
  return <span className={cn('sr-only', className)} {...props} />
}

export default VisuallyHidden
