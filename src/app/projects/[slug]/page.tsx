import {allProjects} from 'contentlayer/generated'
import {notFound} from 'next/navigation'
import {useMDXComponent} from 'next-contentlayer/hooks'
import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), {ssr: false})

export async function generateStaticParams() {
    return allProjects.map(p => ({slug: p.slug}))
}

export default function ProjectPage({params}: { params: { slug: string } }) {
    const project = allProjects.find(p => p.slug === params.slug)
    if (!project) return notFound()

    const MDXContent = useMDXComponent(project.body.code)
    const components = {ModelViewer}

    return (
        <article className="typography max-w-none">
            <h1 className="font-serif">{project.title}</h1>
            <p className="lead">{project.description}</p>
            <MDXContent components={components}/>
        </article>
    )
}
