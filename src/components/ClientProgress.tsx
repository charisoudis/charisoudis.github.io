'use client'

import {useEffect, useRef} from 'react'
import NProgress from 'nprogress'
import {usePathname} from 'next/navigation'

export default function ClientProgress() {
    const pathname = usePathname()
    const startedRef = useRef(false)

    useEffect(() => {
        NProgress.configure({showSpinner: false, trickleSpeed: 120, minimum: 0.08})

        const start = () => {
            if (startedRef.current) return
            startedRef.current = true
            document.documentElement.classList.add('nav-loading')
            NProgress.start()
        }
        const done = () => {
            if (!startedRef.current) return
            startedRef.current = false
            NProgress.done()
            document.documentElement.classList.remove('nav-loading')
        }

        function onPointerStart(e: Event) {
            const target = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null
            if (!target) return
            const isInternal = target.host === window.location.host
            const isNewTab = target.target === '_blank' || (e instanceof MouseEvent && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey))
            const isDownload = target.hasAttribute('download')
            const href = target.getAttribute('href') || ''
            const samePath = href && (new URL(href, window.location.href)).pathname === window.location.pathname

            if (isInternal && !isNewTab && !isDownload && !samePath) start()
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key !== 'Enter') return
            const target = (e.target as HTMLElement)?.closest('a') as HTMLAnchorElement | null
            if (!target) return
            const isInternal = target.host === window.location.host
            const isNewTab = target.target === '_blank'
            const isDownload = target.hasAttribute('download')
            const href = target.getAttribute('href') || ''
            const samePath = href && (new URL(href, window.location.href)).pathname === window.location.pathname

            if (isInternal && !isNewTab && !isDownload && !samePath) start()
        }

        window.addEventListener('mousedown', onPointerStart, true)
        window.addEventListener('touchstart', onPointerStart, {capture: true, passive: true})
        window.addEventListener('keydown', onKeyDown, true)

        return () => {
            window.removeEventListener('mousedown', onPointerStart, true)
            window.removeEventListener('touchstart', onPointerStart as EventListener, true as any)
            window.removeEventListener('keydown', onKeyDown, true)
            NProgress.remove()
            document.documentElement.classList.remove('nav-loading')
            startedRef.current = false
        }
    }, [])

    useEffect(() => {
        if (startedRef.current) {
            NProgress.done()
            document.documentElement.classList.remove('nav-loading')
            startedRef.current = false
        }
    }, [pathname])

    return null
}