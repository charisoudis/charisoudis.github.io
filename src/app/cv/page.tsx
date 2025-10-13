import fs from 'node:fs/promises'
import path from 'node:path'
import {withBase} from '@/lib/paths'
import {FileDown, ExternalLink, Link2} from 'lucide-react'
import {Picture} from '@/components/Picture'

export const metadata = {title: 'CV'}

type Link = { label: string; href: string }
type Course = { name?: string; institution?: string; date?: string; url?: string; image?: string }
type Basics = {
    name?: string
    label?: string
    email?: string
    url?: string
    location?: { city?: string; region?: string; country?: string; countryCode?: string }
    profiles?: { network?: string; username?: string; url?: string }[]
}
type Resume = {
    basics?: Basics
    work?: { name?: string; position?: string; startDate?: string; endDate?: string; summary?: string; url?: string; location?: string; highlights?: string[] }[]
    education?: { institution?: string; area?: string; studyType?: string; startDate?: string; endDate?: string; url?: string; summary?: string; links?: Link[] }[]
    skills?: { name: string; level: 'very_strong' | 'strong' | 'medium'; keywords?: string[] }[]
    certificates?: { name?: string; date?: string; issuer?: string; url?: string }[]
    courses?: Course[]
}

async function loadResume(): Promise<Resume> {
    const file = path.join(process.cwd(), 'content', 'cv', 'resume.json')
    const json = await fs.readFile(file, 'utf-8')
    return JSON.parse(json)
}

function formatRange(start?: string, end?: string) {
    const fmt = (s?: string) => {
        if (!s) return ''
        if (/^\d{4}-\d{2}$/.test(s)) {
            const [y, m] = s.split('-').map(Number)
            return new Date(y, m - 1, 1).toLocaleString('en-US', {month: 'short', year: 'numeric'})
        }
        return s
    }
    const a = fmt(start)
    const b = end ? fmt(end) : 'Present'
    return a && b ? `${a} — ${b}` : a || b || ''
}

const strengthToColor: Record<'very_strong' | 'strong' | 'medium', string> = {
    very_strong: '#000061',
    strong: '#516ca3',
    medium: '#889bc2',
}

export default async function CVPage() {
    const resume = await loadResume()
    const basics = resume.basics
    const gh = basics?.profiles?.find((p) => (p.network || '').toLowerCase() === 'github')
    const li = basics?.profiles?.find((p) => (p.network || '').toLowerCase() === 'linkedin')
    const site = basics?.url?.replace(/^https?:\/\//, '').replace(/\/$/, '')

    return (
        <div className="site-shell">
            <header className="mb-6 flex items-start justify-between gap-4">
                <h1 className="text-xl md:text-2xl font-extrabold text-kth-marine">CV</h1>
                <a
                    href={withBase('/files/resume.pdf')}
                    download
                    aria-label="Download CV as PDF"
                    className="inline-flex items-center gap-2 rounded-md border bg-kth-light hover:bg-kth-light/70 px-3 py-1.5 text-sm"
                    title="Download CV (PDF)"
                >
                    <FileDown className="h-4 w-4"/>
                    <span className="hidden sm:inline">PDF</span>
                </a>
            </header>

            {basics && (
                <section className="rounded-xl border border-zinc-200 bg-white p-5">
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-wide">
                        {(basics.name || '').toUpperCase()}
                    </h2>
                    <div className="mt-2 grid gap-1 text-[15px] leading-6">
                        <div className="flex flex-wrap items-center gap-x-6">
                            {gh?.url && (
                                <span>
                                    GitHub:{' '}
                                    <a href={gh.url} target="_blank" rel="noreferrer" className="font-semibold text-link link-underline">
                                        {gh.username || gh.url.split('/').pop()}
                                    </a>
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6">
                            {li?.url && (
                                <span>
                                  LinkedIn:{' '}
                                    <a href={li.url} target="_blank" rel="noreferrer" className="font-semibold text-link link-underline">
                                        {li.username || li.url.split('/').pop()}
                                    </a>
                                </span>
                            )}
                        </div>
                        {basics.email && (
                            <div>
                                Email: <a href={`mailto:${basics.email}`} className="font-semibold text-link link-underline">{basics.email}</a>
                            </div>
                        )}
                        <div>
                            Address:{' '}
                            <span className={"font-semibold"}>
                                {[basics.location?.city, basics.location?.country || basics.location?.region]
                                    .filter(Boolean)
                                    .join(', ')}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            <section className="mt-8 grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg md:text-xl font-semibold text-kth-marine mb-3">Education</h3>
                    <div className="grid gap-4">
                        {resume.education?.map((e, i) => (
                            <article key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
                                <div className="text-sm text-zinc-500">{formatRange(e.startDate, e.endDate)}</div>
                                <h4 className="mt-1 text-lg font-semibold">
                                    {e.studyType}{e.area ? ` — ${e.area}` : ''}
                                </h4>
                                <div className="text-sm text-zinc-700">{e.institution}</div>
                                {e.summary && <p className="mt-2 text-[15px] leading-6 whitespace-pre-line">{e.summary}</p>}
                                {e.links?.length ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {e.links.map((l, j) => (
                                            <a
                                                key={j}
                                                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-kth-light px-3 py-1.5 text-sm hover:bg-kth-light/70"
                                                href={withBase(l.href)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {l.label}
                                                <ExternalLink className="h-3.5 w-3.5"/>
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg md:text-xl font-semibold text-kth-marine mb-3">Experience</h3>
                    <div className="grid gap-4">
                        {resume.work?.map((w, i) => (
                            <article key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
                                <div className="text-sm text-zinc-500">{formatRange(w.startDate, w.endDate)}</div>
                                <h4 className="mt-1 text-lg font-semibold">
                                    {w.position} {w.name ? `— ${w.name}` : ''}
                                </h4>
                                {w.location && <div className="text-sm text-zinc-700">{w.location}</div>}
                                {w.summary && <p className="mt-2 text-[15px] leading-6">{w.summary}</p>}
                                {w.highlights?.length ? (
                                    <ul className="mt-2 list-disc pl-5 space-y-1">
                                        {w.highlights.map((h, j) => (
                                            <li key={j} className="text-[15px] leading-6">
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <h3 className="text-lg md:text-xl font-semibold text-kth-marine mb-3">Programming Skills</h3>

                <div className="mb-4 flex flex-wrap gap-6 text-sm">
                    <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-3 w-8 rounded-sm" style={{background: '#000061'}}/>
                        <i>Very Strong</i>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-3 w-8 rounded-sm" style={{background: '#516ca3'}}/>
                        <i>Strong</i>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-3 w-8 rounded-sm" style={{background: '#889bc2'}}/>
                        <i>Medium</i>
                    </span>
                </div>

                <ul className="space-y-3">
                    {[
                        {name: 'PYTHON – Deep Learning (PyTorch), TDD, Servers setup & management, ROS, Systems Programming', level: 'very_strong'},
                        {name: 'OpenGL – (python bindings) PyOpenGL, PyRender, pyglet', level: 'strong'},
                        {name: 'MATLAB – DL Toolbox, Robotics (Peter Corke), Fuzzy, Audio Coding, Adaptive Signal Processing, Control', level: 'very_strong'},
                        {name: 'C – Parallel Systems (PThreads, OpenMP, MPI, CUDA)', level: 'strong'},
                        {name: 'C – Operating Systems (Unix)', level: 'medium'},
                        {name: 'JAVA – UDP/TCP, Async IO/NIO, OOP, Algorithms & Data Structures', level: 'strong'},
                        {name: 'PHP – 5 years building PHP + Laravel apps on LAMP', level: 'very_strong'},
                        {name: 'MySQL – Production schemas (eurotechnik.gr, admin.eurotechnik.gr, ECESCON 11, Labyrinth)', level: 'very_strong'},
                        {name: 'GIT – 600+ contributions/year (avg)', level: 'very_strong'},
                        {name: 'ASSEMBLY – MIPS32, ATMEL AVR, ARMv6', level: 'medium'}
                    ].map((s, i) => (
                        <li key={i} className="grid gap-1">
                            <div className="text-[15px] leading-6">{s.name}</div>
                            <div className="h-2.5 w-full rounded bg-zinc-100">
                                <div
                                    className="h-full w-full rounded"
                                    style={{background: strengthToColor[s.level as 'very_strong' | 'strong' | 'medium']}}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {(resume.courses?.length || resume.certificates?.length) ? (
                <section className="mt-10">
                    <h3 className="text-lg md:text-xl font-semibold text-kth-marine mb-4">External Courses & MOOCs</h3>

                    {resume.courses?.length ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {resume.courses.map((c, i) => (
                                <a
                                    key={i}
                                    href={c.url}
                                    target="_blank"
                                    className="group relative block overflow-hidden rounded-xl border border-zinc-200 bg-white"
                                    rel="noreferrer"
                                    title={c.name}
                                >
                                    <div className="aspect-square w-full overflow-hidden">
                                        {c.image ? (
                                            <Picture
                                                id={c.image}
                                                alt={c.name || ''}
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-zinc-100"/>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Link2 className="h-6 w-6 text-white"/>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                                        <div className="text-xs text-white/90 line-clamp-2">{c.name}</div>
                                        <div className="text-[10px] text-white/70">{c.institution}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : null}

                    {resume.certificates?.length ? (
                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            {resume.certificates.map((c, i) => (
                                <article key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
                                    <h4 className="font-semibold">{c.name}</h4>
                                    <div className="text-sm text-zinc-500">{[c.issuer, c.date].filter(Boolean).join(' · ')}</div>
                                    {c.url && (
                                        <a className="mt-2 inline-flex items-center gap-1 text-sm link-underline" href={c.url} target="_blank" rel="noreferrer">
                                            Certificate <ExternalLink className="h-3.5 w-3.5"/>
                                        </a>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : null}
                </section>
            ) : null}
        </div>
    )
}