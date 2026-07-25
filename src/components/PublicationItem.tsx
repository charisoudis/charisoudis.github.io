import {Pub} from '@/lib/bib'
import {CopyBibButton} from './CopyBibButton'
import {Picture} from "@/components/Picture";

export function PublicationItem({pub}: { pub: Pub }) {
    return (
        <li className="flex gap-4 items-start">
            <div className="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-white">
                <Picture id={`publications/${pub.id}`} alt={pub.title} sizes="112px" ratio={"4 / 3"} className="relative w-28 rounded-xl overflow-hidden border border-zinc-200"/>
            </div>
            <div className="min-w-0">
                <div className="text-sm text-zinc-500">
                    {pub.year}
                    {pub.venue ? (
                        ` · ${pub.venue}`
                    ) : pub.note ? (
                        <>
                            {" "}·{" "}
                            <span className="italic">{pub.note}</span>
                        </>
                    ) : null}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-kth-marine mt-0.5">{pub.title}</h3>
                <p className="text-sm">{pub.authors}</p>
                <div className="flex flex-wrap gap-3 text-sm mt-3">
                    {pub.doi && <a href={`https://doi.org/${pub.doi}`} className={"text-link"} target="_blank" rel="noreferrer">DOI</a>}
                    {pub.url && <a href={pub.url} target="_blank" className={"text-link"} rel="noreferrer">Link</a>}
                    {pub.pdf && <a href={pub.pdf} target="_blank" rel="noreferrer">PDF</a>}
                    {pub.code && <a href={pub.code} target="_blank" className={"text-link"} rel="noreferrer">Code</a>}
                    {pub.bibtex && <CopyBibButton bibtex={pub.bibtex}/>}
                </div>
            </div>
        </li>
    )
}