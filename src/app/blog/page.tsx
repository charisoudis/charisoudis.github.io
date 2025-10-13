import {allPosts} from 'contentlayer/generated'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {title: 'Blog'}

export default function BlogPage() {
    const posts = allPosts
        .filter(p => !p.draft)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-kth-marine mb-6">Blog</h1>
            <ul className="grid gap-6">
                {posts.map(post => (
                    <li key={post._id} className="card flex gap-4">
                        {post.image ? (
                            <div className="relative w-40 h-28 shrink-0 rounded-xl overflow-hidden border border-zinc-200">
                                <Image src={post.image} alt={post.title} fill className="object-cover"/>
                            </div>
                        ) : null}
                        <div className="min-w-0">
                            <h2 className="text-xl md:text-2xl font-semibold text-kth-marine">
                                <Link href={post.url}>{post.title}</Link>
                            </h2>
                            <div className="text-sm text-zinc-500">{new Date(post.date).toLocaleDateString()}</div>
                            {post.summary && <p className="mt-1 text-sm">{post.summary}</p>}
                            {post.tags?.length ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {post.tags.map(t => <span key={t} className="text-xs rounded-full border px-2 py-0.5">{t}</span>)}
                                </div>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
