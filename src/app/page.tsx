import Image from 'next/image'
import {Github, Linkedin, FileText} from 'lucide-react'
import Link from 'next/link'
import {allProjects} from 'contentlayer/generated'
import {Section} from '@/components/Section'
import {ProjectCard} from '@/components/ProjectCard'
import {loadPublications} from '@/lib/bib'
import resumeData from '@/../content/cv/resume.json'
import {Picture} from "@/components/Picture";
import {PublicationItem} from "@/components/PublicationItem";
import {withBase} from "@/lib/paths";

export default async function Home() {
    const projects = allProjects.filter(p => p.featured).sort((a, b) => Number(b.year ?? 0) - Number(a.year ?? 0)).slice(0, 4)
    const pubs = (await loadPublications()).slice(0, 3)
    const interests = (resumeData as any)?.interests?.flatMap((i: any) => i.keywords || [i.name]).filter(Boolean) || []

    return (
        <div className="space-y-12 md:space-y-20">
            <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-zinc-200">
                    <Picture id="profile" alt="Athanasios Charisoudis" sizes="112px" ratio={1} className="w-28 h-28 rounded-full overflow-hidden border border-zinc-200"/>
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-kth-marine">Athanasios Charisoudis</h1>

                    <p className="mt-3 text-lg">
                        I’m a Research Engineer at Hochschule Luzern working on computer vision, especially dynamic 3D representations,
                        metric deep learning, and motion recovery in real-world environments. Previously, I completed an MSc in Machine
                        Learning at KTH Royal Institute of Technology (Stockholm). Before that, I earned a Diploma in Electrical &amp;
                        Computer Engineering from the Aristotle University of Thessaloniki, my hometown. I enjoy turning research ideas into practical, fast tools.
                    </p>

                    <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-sm">
                        <div className="flex gap-2">
                            <dt className="font-semibold text-zinc-700 min-w-[7rem]">Name:</dt>
                            <dd>Athanasios Charisoudis</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-semibold text-zinc-700 min-w-[7rem]">Nickname:</dt>
                            <dd>Thanos</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-semibold text-zinc-700 min-w-[7rem]">Job:</dt>
                            <dd>Research Engineer, Hochschule Luzern</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-semibold text-zinc-700 min-w-[7rem]">Citizenship:</dt>
                            <dd>Greek</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-semibold text-zinc-700 min-w-[7rem]">Residence:</dt>
                            <dd>Rotkreuz, Switzerland</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-semibold text-zinc-700 min-w-[7rem]">E-mail:</dt>
                            <dd><a href="mailto:athanasios.charisoudis@ieee.org">athanasios.charisoudis@ieee.org</a></dd>
                        </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                        <a
                            href={withBase('/files/resume.pdf')}
                            download
                            title="Download CV" aria-label="Download CV"
                            className="inline-flex items-center rounded-lg bg-kth-light px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90"
                        >
                            CV
                        </a>

                        <a href="https://github.com/charisoudis" title="GitHub" target="_blank" rel="noreferrer" aria-label="GitHub" className="inline-flex items-center rounded-lg bg-kth-light px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90">
                            <Github className="w-5 h-5"/>
                        </a>

                        <a href="https://linkedin.com/in/charisoudis" title="LinkedIn" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="inline-flex items-center rounded-lg bg-kth-light px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90">
                            <Linkedin className="w-5 h-5"/>
                        </a>

                        {/*<div className="ml-auto flex items-center gap-4">*/}
                        {/*    <a href="https://github.com/charisoudis" target="_blank" rel="noreferrer" aria-label="GitHub">*/}
                        {/*        <Github className="w-5 h-5"/>*/}
                        {/*    </a>*/}
                        {/*    <a href="https://linkedin.com/in/charisoudis" target="_blank" rel="noreferrer" aria-label="LinkedIn">*/}
                        {/*        <Linkedin className="w-5 h-5"/>*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </div>

                    {interests.length ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {interests.slice(0, 12).map((k: string, i: number) => (
                                <span key={i} className="text-xs rounded-full border px-2 py-0.5">{k}</span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            <Section title="Selected Publications">
                <ul className="grid gap-6">
                    {pubs.map(p => (
                        <PublicationItem key={p.id} pub={p}/>
                    ))}
                </ul>
                <div className="mt-2">
                    <Link href="/publications" className="text-md text-link">All publications</Link>
                </div>
            </Section>

            <Section title="Notable Projects">
                <div className="grid md:grid-cols-2 gap-6">
                    {projects.map(p => <ProjectCard key={p._id} project={p}/>)}
                </div>
                <div className="mt-2">
                    <Link href="/projects" className="text-md text-link">All projects</Link>
                </div>
            </Section>

            <Section title="Interests">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="card">
                        <div className="flex items-start gap-4">
                            <Picture id="interests/humans" alt="Human 3D Avatars" sizes="36px" ratio={1} className="h-9 w-9 shrink-0"/>
                            <div>
                                <div className="text-lg font-semibold">Human 3D Avatars</div>
                                <p className="text-sm">Capturing and rendering of humans in motion for immersive reality.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-start gap-4">
                            <Picture id="interests/generative-models" alt="Generative Models" sizes="36px" ratio={1} className="h-9 w-9 shrink-0"/>
                            <div>
                                <div className="text-lg font-semibold">Generative Models</div>
                                <p className="text-sm">GANs and flow-based generative models for vision tasks.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-start gap-4">
                            <Picture id="interests/deep-learning" alt="Deep Learning" sizes="36px" ratio={1} className="h-9 w-9 shrink-0"/>
                            <div>
                                <div className="text-lg font-semibold">Deep Learning</div>
                                <p className="text-sm">Neural networks for vision and computational acoustics; deep RL.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-start gap-4">
                            <Picture id="interests/intelligent-robots" alt="Intelligent Robots" sizes="36px" ratio={1} className="h-9 w-9 shrink-0"/>
                            <div>
                                <div className="text-lg font-semibold">Intelligent Robots</div>
                                <p className="text-sm">AI techniques for robot systems with strong perception.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-start gap-4">
                            <Picture id="interests/tdd" alt="Test-Driven Development" sizes="36px" ratio={1} className="h-9 w-9 shrink-0"/>
                            <div>
                                <div className="text-lg font-semibold">Test-Driven Development</div>
                                <p className="text-sm">High-quality, stable code guided by extensive unit tests.</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-start gap-4">
                            <Picture id="interests/php-laravel" alt="PHP + Laravel" sizes="36px" ratio={1} className="h-9 w-9 shrink-0"/>
                            <div>
                                <div className="text-lg font-semibold">Web Dev</div>
                                <p className="text-sm">Fan of Next.js stacks. Experience with PHP/Laravel.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}