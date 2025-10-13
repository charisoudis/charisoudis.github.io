'use client'

;(globalThis as any).process = (globalThis as any).process || {env: {}}

import * as React from 'react'
import {useMDXComponent} from 'next-contentlayer/hooks'

const components = {
    img: (props: any) => (
        <img loading="lazy" decoding="async" {...props} />
    ),
    a: (props: any) => (
        <a
            {...props}
            className={`link-underline ${props.className || ''}`}
            rel={props.target === '_blank' ? 'noopener noreferrer' : undefined}
        />
    ),
}

export default function MDXRenderer({code}: { code: string }) {
    const MDX = useMDXComponent(code)
    return <MDX components={components as any}/>
}