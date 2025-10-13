'use client'
import {useState} from 'react'
import {Check} from 'lucide-react'

export function CopyBibButton({bibtex}: { bibtex: string }) {
    const [copied, setCopied] = useState(false)

    async function handleClick() {
        try {
            await navigator.clipboard.writeText(bibtex)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
        } catch {}
    }

    return (
        <a
            type="button"
            onClick={handleClick}
            title="Copy BibTeX"
            aria-label="Copy BibTeX"
            className={`inline-flex items-center gap-1 text-link text-sm cursor-pointer`}
        >
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <span>BIB</span>}
        </a>
    )
}