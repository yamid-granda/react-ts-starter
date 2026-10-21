import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

const variants = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline-indigo-600',
  secondary:
    'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-slate-900',
} as const

const sizes = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4',
} as const

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
