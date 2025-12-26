import { motion } from 'framer-motion'
import { cn } from './Button'

export function Section({ id, className, children, dark = false }) {
    return (
        <section
            id={id}
            className={cn(
                "relative py-20 px-4 md:px-8 overflow-hidden",
                dark ? "bg-dark-bg" : "bg-card-bg/20",
                className
            )}
        >
            <div className="max-w-7xl mx-auto relative z-10 font-sans">
                {children}
            </div>

            {/* Optional Grid Background for 'tech' feel */}
            {!dark && (
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            )}
        </section>
    )
}
