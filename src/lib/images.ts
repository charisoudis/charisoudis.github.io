import manifest from '@/data/image-manifest.json'

export type Variant = { w: number; src: string }
export type Entry = {
    width: number | null
    height: number | null
    aspect?: number
    variants: Record<'avif' | 'webp' | 'jpg' | 'png' | string, Variant[]>
}

export function getImageEntry(id: string): Entry | null {
    return (manifest as Record<string, Entry>)[id] || null
}

export function makeSrcSet(list: Variant[]) {
    return list.sort((a, b) => a.w - b.w).map(v => `${v.src} ${v.w}w`).join(', ')
}