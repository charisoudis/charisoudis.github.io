
'use client'
import { MDXProvider } from '@mdx-js/react'
import React from 'react'

const components = {
  // Add custom components that can be used inside MDX, e.g. <Note />
}

export function MDX({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
