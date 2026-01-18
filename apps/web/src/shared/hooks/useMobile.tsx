import * as React from 'react'

const DEFAULT_MOBILE_BREAKPOINT = 1024

interface UseIsMobileProps {
    breakpoint?: number
}

export function useIsMobile({ breakpoint = DEFAULT_MOBILE_BREAKPOINT }: UseIsMobileProps = {}) {
    const [isMobile, setIsMobile] = React.useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
    )

    React.useEffect(() => {
        if (typeof window === 'undefined') return

        const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
        const onChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        // Set initial state correctly
        setIsMobile(mql.matches)

        mql.addEventListener('change', onChange)
        return () => mql.removeEventListener('change', onChange)
    }, [breakpoint])

    return isMobile
}
