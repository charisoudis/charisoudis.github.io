import Link from 'next/link'
import {Project} from 'contentlayer/generated'
import {Picture} from "@/components/Picture";

export function ProjectCard({project}: { project: Project }) {
    return (
        <article className="card flex gap-4">
            <div className="relative w-48 h-32 shrink-0 rounded-xl overflow-hidden">
                <Picture
                    id={`projects/${project.slug}`}
                    alt={project.title}
                    ratio={"16 / 9"}
                    sizes="(min-width: 768px) 320px, 90vw"
                    className="w-full rounded-xl overflow-hidden border border-zinc-200"
                />
            </div>
            <div className="min-w-0">
                <h3 className="text-xl font-semibold text-kth-marine">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </h3>
                <p className="text-sm text-zinc-700 mt-1">{project.summary}</p>
                {project.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {project.tags.map(t => <span key={t} className="text-xs rounded-full border px-2 py-0.5">{t}</span>)}
                    </div>
                ) : null}
            </div>
        </article>
    )
}