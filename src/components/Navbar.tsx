'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import clsx from 'clsx'
import {Container} from './Container'

const links = [
    {href: '/publications', label: 'Publications'},
    {href: '/projects', label: 'Projects'},
    {href: '/blog', label: 'Blog'},
    {href: '/cv', label: 'CV'}
]

export function Navbar() {
    const pathname = usePathname()
    return (
        <header className="sticky top-0 z-40 backdrop-blur bg-kth-marine text-white border-b border-kth-marine">
            <Container>
                <nav className="h-16 flex items-center justify-between">
                    <Link href="/" className="font-sans text-xl font-semibold text-white">Athanasios Charisoudis</Link>
                    <div className="flex items-center gap-6">
                        {links.map(l => (
                            <Link
                                key={l.href}
                                className={clsx(
                                    "text-[15px] sm:text-base text-white/90 hover:text-white",
                                    pathname === l.href && "font-bold"
                                )}
                                href={l.href}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            </Container>
        </header>
    )
}