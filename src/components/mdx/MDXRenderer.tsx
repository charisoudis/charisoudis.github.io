import * as React from 'react'
import {useMDXComponent} from 'next-contentlayer/hooks'
import Conv2DCalcClient from './Conv2DCalcClient'
import {Picture} from '@/components/Picture'

function ContentImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const src = props.src || ''
    if (/^https?:\/\//i.test(src)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} />
    }
    const id = src.replace(/^\/+/, '').replace(/^media\//, '')
    return (
        <Picture
            id={id}
            alt={props.alt || ''}
            sizes={props.sizes || '100vw'}
            className="w-full"
        />
    )
}

const components = {
    img: ContentImage,
    Conv2DCalc: Conv2DCalcClient, // client island
} as any

export default function MDXRenderer({code}: { code: string }) {
    const MDX = useMDXComponent(code)
    return <MDX components={components}/>
}