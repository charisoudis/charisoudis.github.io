import {Github, Linkedin} from 'lucide-react'
import Link from 'next/link'
import {allProjects} from 'contentlayer/generated'
import {Section} from '@/components/Section'
import {ProjectCard} from '@/components/ProjectCard'
import {loadPublications} from '@/lib/bib'
import resumeData from '@/../content/cv/resume.json'
import {Picture} from "@/components/Picture";
import {PublicationItem} from "@/components/PublicationItem";
import {withBase} from "@/lib/paths";
import type {Metadata} from 'next'

export const metadata: Metadata = {title: {absolute: 'Athanasios Charisoudis'}}

export default async function Home() {
    const projects = allProjects
        .filter(p => p.featured)
        .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
        .slice(0, 4)
    const pubs = (await loadPublications()).slice(0, 3)
    const interests = (resumeData as any)?.interests?.flatMap((i: any) => i.keywords || [i.name]).filter(Boolean) || []

    return (
        <div className="space-y-12 md:space-y-20">
            <section className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-zinc-200">
                    <Picture id="profile" alt="Athanasios Charisoudis" sizes="112px" ratio={1} className="w-28 h-28 rounded-full overflow-hidden border border-zinc-200"/>
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-kth-marine">Hi, I’m Thanos</h1>

                    <p className="mt-3 text-lg leading-relaxed">
                        I’m a research engineer at Hochschule Luzern working on human-centric computer vision, including dynamic 3D representations,
                        metric deep learning, and motion recovery, under the advise of <a href={"https://www.hslu.ch/en/lucerne-university-of-applied-sciences-and-arts/about-us/people-finder/profile/?pid=5280"} target={"_blank"} className={"text-link"}>Prof. Aljosa Smolic</a>. I like turning research ideas into fast, practical tools that people can use.
                    </p>

                    <p className="mt-3 text-lg leading-relaxed">
                        Before this, I completed a MSc in Machine Learning at KTH Royal Institute of Technology, where I worked with <a href={"https://www.kth.se/profile/hedvig"} target={"_blank"} className={"text-link"}>Prof. Hedvig Kjellström</a>. Earlier, I earned a Diploma in Electrical &amp; Computer Engineering from Aristotle University of Thessaloniki, where I worked with <a href={"https://ece.auth.gr/en/staff/pericles-mitkas/"} target={"_blank"}
                                                                                                                                                                                                                                                                                                                                                                                                 className={"text-link"}>Prof. Pericles Mitkas</a>. I’m based in Rotkreuz, Switzerland, while my
                        hometown is Thessaloniki, Greece.
                    </p>

                    <p className="mt-3 text-lg leading-relaxed">
                        Outside of work, I used to make electronic music and do graphic design. These days I relax with freelance web development, my go-to antistressant. When I’m away from the keyboard, I’m usually on a bike in the mountains or forests.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <a
                            href={withBase('/files/resume.pdf') + "?t=07_2026"}
                            download
                            title="Download CV"
                            aria-label="Download CV"
                            className="inline-flex items-center rounded-lg bg-kth-light px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90"
                        >
                            CV
                        </a>

                        <a
                            href="mailto:athanasios.charisoudis@ieee.org"
                            title="Email"
                            aria-label="Email"
                            className="inline-flex items-center rounded-lg bg-kth-light px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90"
                        >
                            Email
                        </a>

                        <a
                            href="https://github.com/charisoudis"
                            title="GitHub"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                            className="inline-flex items-center rounded-lg bg-kth-light px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90"
                        >
                            <Github className="w-5 h-5"/>
                        </a>

                        <a
                            href="https://linkedin.com/in/charisoudis"
                            title="LinkedIn"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="inline-flex items-center rounded-lg bg-kth-light px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90"
                        >
                            <Linkedin className="w-5 h-5"/>
                        </a>
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