import type {Pub} from '@/lib/bib'

export function PublicationCard({pub}: { pub: Pub }) {
    return (
        <article className="card">
            <div className="text-sm text-zinc-500">{pub.year} · {pub.venue}</div>
            <h3 className="text-xl md:text-2xl font-bold text-kth-marine mt-1">{pub.title}</h3>
            <p className="text-sm mt-1">{pub.authors}</p>
            <div className="flex gap-3 text-sm mt-3">
                {pub.doi && <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer">DOI</a>}
                {pub.url && <a href={pub.url} target="_blank" rel="noreferrer">Link</a>}
                {pub.pdf && <a href={pub.pdf} target="_blank" rel="noreferrer">PDF</a>}
                {pub.code && <a href={pub.code} target="_blank" rel="noreferrer">Code</a>}
            </div>
        </article>
    )
}
