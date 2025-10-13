import {loadPublications} from '@/lib/bib'
import {PublicationItem} from '@/components/PublicationItem'

export const metadata = {title: 'Publications'}

export default async function PublicationsPage() {
    const pubs = await loadPublications()
    const groups = pubs.reduce<Record<string, typeof pubs>>((acc, p) => {
        const y = p.year || 'Other'
        acc[y] = acc[y] || []
        acc[y].push(p)
        return acc
    }, {})
    const years = Object.keys(groups).sort((a, b) => parseInt(b) - parseInt(a))

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-kth-marine mb-6">Publications</h1>
            <div className="space-y-10">
                {years.map(y => (
                    <section key={y}>
                        <h3 className="text-1xl md:text-2xl font-semibold text-kth-marine mb-4">{y}</h3>
                        <ul className="grid gap-6">
                            {groups[y].map(p => <PublicationItem key={p.id} pub={p}/>)}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    )
}