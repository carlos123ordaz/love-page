import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-body font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 active:translate-y-0',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-accent-strong hover:-translate-y-px hover:shadow-sticker',
                destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
                outline: 'bg-transparent text-ink hover:bg-paper-2 ring-1 ring-inset ring-hairline',
                secondary: 'bg-paper-3 text-ink hover:bg-lila-2 hover:-translate-y-px',
                ghost: 'text-ink-soft hover:bg-paper-2 hover:text-ink',
                link: 'text-primary underline-offset-4 hover:underline',
                gradient: 'bg-primary text-primary-foreground hover:bg-accent-strong hover:-translate-y-px hover:shadow-sticker',
            },
            size: {
                default: 'h-11 px-5',
                sm: 'h-9 rounded-sm px-4 text-caption',
                lg: 'h-12 rounded-md px-6 text-body-lg',
                xl: 'h-14 rounded-lg px-8 text-lead',
                icon: 'h-11 w-11 rounded-full',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Cargando...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };