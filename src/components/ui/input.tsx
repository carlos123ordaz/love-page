import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-caption font-semibold text-ink-soft">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-12 w-full rounded-md border border-transparent bg-paper-2 px-4 py-2 text-body-lg text-ink transition-all duration-150 file:border-0 file:bg-transparent file:text-caption file:font-medium placeholder:text-ink-faint focus-visible:border-accent-purple/60 focus-visible:bg-paper-soft focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent-purple/20 disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-2 text-caption text-destructive">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };