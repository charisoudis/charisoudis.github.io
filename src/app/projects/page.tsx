import {allProjects} from 'contentlayer/generated'
import {ProjectCard} from '@/components/ProjectCard'

export const metadata = {title: 'Notable Projects'}

export default function ProjectsPage() {
    const projects = allProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-serif mb-6">Notable Projects</h1>
            <div className="grid gap-4">
                {projects.map(p => <ProjectCard key={p._id} project={p}/>)}
            </div>
        </div>
    )
}
