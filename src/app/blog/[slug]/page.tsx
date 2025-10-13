import {allPosts} from 'contentlayer/generated'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import MDXRenderer from '@/components/mdx/MDXRenderer'

export const dynamicParams = true

export function generateStaticParams() {
    return allPosts.map(p => ({slug: p.slug}))
}

export function generateMetadata({params}: { params: { slug: string } }) {
    const post = allPosts.find(p => p.slug === params.slug)
    if (!post) return {}
    return {title: post.title, description: post.summary}
}

export default function PostPage({params}: { params: { slug: string } }) {
    const post = allPosts.find(p => p.slug === params.slug)
    if (!post) return notFound()

    return (
        <article className="typography max-w-none">
            <header className="mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-kth-marine">{post.title}</h1>
                <div className="text-sm text-zinc-500">{new Date(post.date).toLocaleDateString()}</div>
                {post.image ? (
                    <div className="relative w-full h-64 mt-4 rounded-xl overflow-hidden border border-zinc-200">
                        <Image src={post.image} alt={post.title} fill className="object-cover"/>
                    </div>
                ) : null}
            </header>

            {/* Client MDX renderer to support interactive components (Conv2D calculator) without using MDXProvider on the server */}
            <MDXRenderer code={post.body.code}/>
        </article>
    )
}