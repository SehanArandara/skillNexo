import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion } from 'framer-motion'
import React from 'react'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? motion.div : motion.button

    const variants = {
        primary: 'bg-primary hover:bg-opacity-90 text-white shadow-lg shadow-primary/25',
        secondary: 'bg-secondary hover:bg-opacity-90 text-white shadow-lg shadow-secondary/25',
        outline: 'border border-primary text-primary hover:bg-primary/10',
        ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg font-bold',
    }

    return (
        <Comp
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
})

Button.displayName = 'Button'

export { Button }
