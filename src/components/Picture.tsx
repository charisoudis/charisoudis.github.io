import React from 'react'
import {getImageEntry, makeSrcSet} from '@/lib/images'

type Props = {
    id: string
    alt: string
    sizes?: string
    className?: string
    imgClassName?: string
    priority?: boolean
    ratio?: number | string
}

function ratioToString(r?: number | string) {
    if (!r) return undefined
    return typeof r === 'number' ? String(r) : r
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
const withBase = (p: string) => `${BASE}${p.startsWith('/') ? p : `/${p}`}`

export function Picture({id, alt, sizes = '100vw', className, imgClassName, priority, ratio}: Props) {
    const entry = getImageEntry(id)
    if (!entry) return null

    const format = (k: string) => (entry.variants[k] || []).map(v => ({...v, src: withBase(v.src)}))
    const avif = format('avif')
    const webp = format('webp')
    const jpg = format('jpg')
    const png = format('png')

    const boxStyle: React.CSSProperties = {
        aspectRatio: ratioToString(ratio) ?? (entry.width && entry.height ? `${entry.width}/${entry.height}` : undefined),
        display: 'block',
    }

    const biggest = (arr: { w: number; src: string }[]) => arr.slice().sort((a, b) => a.w - b.w).pop()?.src
    const fallback = biggest(jpg) || biggest(png) || biggest(webp) || ''

    return (
        <picture className={className} style={boxStyle}>
            {avif.length ? <source type="image/avif" srcSet={makeSrcSet(avif)} sizes={sizes}/> : null}
            {webp.length ? <source type="image/webp" srcSet={makeSrcSet(webp)} sizes={sizes}/> : null}
            {png.length ? <source type="image/png" srcSet={makeSrcSet(png)} sizes={sizes}/> : null}
            <img
                src={fallback}
                alt={alt}
                width={entry.width ?? undefined}
                height={entry.height ?? undefined}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className={imgClassName}
                style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block'}}
            />
        </picture>
    )
}