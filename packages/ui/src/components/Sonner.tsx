'use client'

import { Button } from '@workspace/ui/components/Button'
import { AlertTriangleIcon, CircleCheckIcon, CircleXIcon, InfoIcon, XIcon } from 'lucide-react'
import { toast as sonnerToast, Toaster, ToastT } from 'sonner'

interface ToastProps {
    id: string | number
    title: string
    description?: React.ReactNode
    variant?: 'success' | 'error' | 'info' | 'warning' | 'neutral'
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
    const { title, description, id, variant = 'neutral' } = props

    return (
        <div className="group bg-popover shadow-popover relative flex min-h-[64px] w-full items-center gap-3 rounded-xl border px-4 py-2.5 pr-7 md:w-[364px]">
            <ToastIcon variant={variant} />
            <div className="flex flex-1 items-center">
                <div className="w-full">
                    <p className="text-foreground text-sm font-semibold">{title}</p>
                    {description && (
                        <div className="text-muted-foreground mt-0.5 text-sm">{description}</div>
                    )}
                </div>
            </div>
            <Button
                size="iconSm"
                variant="ghost"
                onClick={() => sonnerToast.dismiss(id)}
                className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
            >
                <XIcon className="text-muted-foreground h-4 w-4" />
            </Button>
        </div>
    )
}

function ToastIcon({ variant }: { variant: ToastProps['variant'] }) {
    if (variant === 'neutral') {
        return null
    }

    return (
        <>
            {variant === 'success' && (
                <CircleCheckIcon className="size-5 text-green-500 dark:text-green-400" />
            )}
            {variant === 'error' && <CircleXIcon className="text-destructive-foreground size-5" />}
            {variant === 'info' && <InfoIcon className="size-5 text-blue-500 dark:text-blue-400" />}
            {variant === 'warning' && (
                <AlertTriangleIcon className="size-5 text-yellow-500 dark:text-yellow-400" />
            )}
        </>
    )
}

function createToast(variant: ToastProps['variant']) {
    return (
        props: Omit<ToastProps, 'id' | 'variant'>,
        options: Pick<ToastT, 'position' | 'duration'> = {},
    ) => {
        return sonnerToast.custom((id) => <Toast id={id} variant={variant} {...props} />, {
            position: 'top-right',
            ...options,
        })
    }
}

const success = createToast('success')
const error = createToast('error')
const info = createToast('info')
const warning = createToast('warning')
const neutral = createToast('neutral')

const toast = {
    success,
    error,
    info,
    warning,
    neutral,
}

export { toast, Toaster }
