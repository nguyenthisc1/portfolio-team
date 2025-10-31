'use client'

import { GripHorizontal } from 'lucide-react'
import {
    Button as AriaButton,
    GridList as AriaGridList,
    GridListItem as AriaGridListItem,
    GridListItemProps as AriaGridListItemProps,
    GridListProps as AriaGridListProps,
    composeRenderProps,
} from 'react-aria-components'

import { cn } from '@workspace/ui/lib/utils'

import { Checkbox } from './Checkbox'

export function GridList<T extends object>({ children, ...props }: AriaGridListProps<T>) {
    return (
        <AriaGridList
            {...props}
            className={composeRenderProps(props.className, (className) =>
                cn(
                    'jolly-GridList group bg-popover text-popover-foreground flex flex-col gap-2 overflow-auto rounded-md border p-1 shadow-md outline-none',
                    /* Empty */
                    'data-[empty]:p-6 data-[empty]:text-center data-[empty]:text-sm',
                    className,
                ),
            )}
        >
            {children}
        </AriaGridList>
    )
}

export function GridListItem({ children, className, ...props }: AriaGridListItemProps) {
    let textValue = typeof children === 'string' ? children : undefined
    return (
        <AriaGridListItem
            textValue={textValue}
            className={composeRenderProps(className, (className) =>
                cn(
                    'jolly-GridListItem relative flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
                    /* Disabled */
                    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    /* Focus Visible */
                    'data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-background data-[focus-visible]:z-10 data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:outline-none',
                    /* Hovered */
                    'data-[hovered]:bg-accent data-[hovered]:text-accent-foreground',
                    /* Selected */
                    'data-[selected]:bg-accent data-[selected]:text-accent-foreground',
                    /* Dragging */
                    'data-[dragging]:opacity-60',
                    className,
                ),
            )}
            {...props}
        >
            {composeRenderProps(children, (children, renderProps) => (
                <>
                    {/* Add elements for drag and drop and selection. */}
                    {renderProps.allowsDragging && (
                        <AriaButton slot="drag">
                            <GripHorizontal className="size-4" />
                        </AriaButton>
                    )}
                    {renderProps.selectionMode === 'multiple' &&
                        renderProps.selectionBehavior === 'toggle' && <Checkbox slot="selection" />}
                    {children}
                </>
            ))}
        </AriaGridListItem>
    )
}
