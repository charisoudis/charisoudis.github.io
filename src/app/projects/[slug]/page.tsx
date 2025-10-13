import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import { allProjects } from 'contentlayer/generated'
import MDXRenderer from '@/components/mdx/MDXRenderer'
import PDFEmbed from '@/components/PDFEmbed'
import { withBase } from '@/lib/paths'
import ProjectLinks from '@/components/ProjectLinks'
import {Picture} from "@/components/Picture";

export async function generateStaticParams() {
    return allProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const project = allProjects.find((p) => p.slug === params.slug)
    if (!project) return {}
    const title = project.title
    const description =
        project.summary ||
        [project.projectType, project.year, (project as any).authors?.join(', ')].filter(Boolean).join(' · ') ||
        title
    const url = `/projects/${project.slug}`
    const visual = (project as any).hero || (project as any).image
    const images = visual ? [{ url: withBase(visual) }] : undefined
    const authors =
        (project as any).authors && Array.isArray((project as any).authors)
            ? (project as any).authors.map((n: string) => ({ name: n }))
            : undefined

    return {
        title,
        description,
        keywords: (project as any).tags || [],
        authors,
        alternates: { canonical: url },
        openGraph: {
            type: 'article',
            title,
            description,
            url,
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images?.map((i) => i.url),
        },
    }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
    const project = allProjects.find((p) => p.slug === params.slug)
    if (!project) return notFound()

    const {
        title,
        authors,
        supervisor,
        projectType,
        year,
        tags,
        featured,
        codeUrl,
        image,
        imageAlt,
        hero,
        heroAlt,
        report,
        body,
        slug,
    } = project as any

    const visual = hero || image
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: title,
        url: `/projects/${slug}`,
        image: visual ? withBase(visual) : undefined,
        author: authors?.length ? authors.map((n: string) => ({ '@type': 'Person', name: n })) : undefined,
        contributor: supervisor ? [{ '@type': 'Person', name: supervisor }] : undefined,
        about: tags?.length ? tags : undefined,
        datePublished: year || undefined,
        programmingLanguage: 'Python',
        codeRepository: codeUrl || undefined,
    }

    return (
        <div>
            <Script id="ld-project" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <header className="mb-8 pb-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-kth-marine">{title}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-600">
                            {authors?.length ? <span>By {authors.join(', ')}</span> : null}
                            {supervisor ? <span>· Supervisor: {supervisor}</span> : null}
                            {projectType ? <span>· Type: {projectType}</span> : null}
                            {year ? <span>· {year}</span> : null}
                            {featured ? <span className="rounded-full bg-kth-light px-2 py-0.5 text-xs font-semibold text-kth-marine">Featured</span> : null}
                        </div>
                        {tags?.length ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {tags.map((t: string, i: number) => (
                                    <span key={i} className="rounded-full border px-2 py-0.5 text-xs">{t}</span>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <ProjectLinks codeUrl={codeUrl} report={report} />
                </div>

                <Picture
                    id={`projects/${project.slug}`}
                    alt={project.title}
                    ratio={"16 / 9"}
                    sizes="(min-width: 768px) 320px, 90vw"
                    className="w-full rounded-xl overflow-hidden max-w-2xl mt-4 border border-zinc-200"
                />
            </header>

            <article className="prose max-w-none">
                <MDXRenderer code={body.code} />
            </article>

            {report ? (
                <section className="mt-10">
                    <h2 className="text-xl font-semibold text-kth-marine mb-3">Report</h2>
                    <PDFEmbed src={report} height={900} />
                </section>
            ) : null}
        </div>
    )
}