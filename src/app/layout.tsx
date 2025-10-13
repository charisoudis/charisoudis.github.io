import '@/styles/globals.css'
import {Figtree, JetBrains_Mono} from 'next/font/google'
import {Navbar} from '@/components/Navbar'
import {Footer} from '@/components/Footer'
import {Providers} from './providers'
import ClientProgress from '@/components/ClientProgress'
import PageTransition from '@/components/PageTransition'
import {Container} from '@/components/Container'

const figtree = Figtree({subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-figtree'})
const jet = JetBrains_Mono({subsets: ['latin'], variable: '--font-jet'})

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${figtree.variable} ${jet.variable} min-h-screen flex flex-col font-sans antialiased`}>
        <Providers>
            <ClientProgress/>
            <Navbar/>
            <main className="flex-1">
                <Container className="py-12">
                    <PageTransition>{children}</PageTransition>
                </Container>
            </main>
            <Footer/>
        </Providers>
        </body>
        </html>
    )
}