'use server'

import fs from 'node:fs/promises'
import path from 'node:path'
import Cite from 'citation-js'

export type Pub = {
    id: string
    title: string
    authors: string
    year?: string
    venue?: string
    url?: string
    doi?: string
    pdf?: string
    code?: string
    type?: string
    bibtex?: string
    image?: string
}

function formatAuthors(names: any[]): string {
    try {
        return names
            .map((n: any) => {
                const given = Array.isArray(n.given) ? n.given.join(' ') : (n.given || '')
                const family = Array.isArray(n.family) ? n.family.join(' ') : (n.family || '')
                return [given, family].filter(Boolean).join(' ')
            })
            .join(', ')
    } catch {
        return ''
    }
}

export async function loadPublications(): Promise<Pub[]> {
    const bibPath = path.join(process.cwd(), 'content', 'publications', 'pubs.bib')
    const bib = await fs.readFile(bibPath, 'utf-8')
    const cite = new Cite(bib)

    const data = cite.data as any[]
    const pubs: Pub[] = data.map((item) => {
        const id = item.id || item.label || item['citation-key'] || Math.random().toString(36).slice(2)
        const authors = item.author ? formatAuthors(item.author) : ''
        const title = item.title || ''
        const year = (item.issued && item.issued['date-parts'] && item.issued['date-parts'][0]?.[0]?.toString()) || item.year
        const venue = item['container-title'] || item.publisher || item.journal || item.booktitle
        const doi = item.DOI || item.doi
        const url = item.URL || item.url
        const pdf = item.PDF || item.pdf
        const code = item.CODE || item.code
        const bibtex = new Cite(item).format('bibtex')

        return {id, title, authors, year, venue, doi, url, pdf, code, type: item.type, bibtex}
    })

    const imagesMapPath = path.join(process.cwd(), 'src', 'content-maps', 'pub-images.json')
    let imagesMap: Record<string, string> = {}
    try {
        const raw = await fs.readFile(imagesMapPath, 'utf-8')
        imagesMap = JSON.parse(raw)
    } catch {
    }

    pubs.forEach(p => {
        p.image = imagesMap[p.id] || imagesMap[p.title] || imagesMap[p.doi || ''] || '/images/pubs/default.jpg'
    })
    pubs.sort((a, b) => (parseInt(b.year || '0') - parseInt(a.year || '0')))
    return pubs
}