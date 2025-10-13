'use client'

import {useState} from 'react'
import {Check, Clipboard} from 'lucide-react'

export function CopyBibButton({bibtex}: { bibtex: string }) {
    const [copied, setCopied] = useState(false)
    return (
        <button
            onClick={async () => {
                await navigator.clipboard.writeText(bibtex)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
            }}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
            aria-label="Copy BibTeX"
            title="Copy BibTeX"
            type="button"
        >
            {copied ? <Check size={16}/> : <Clipboard size={16}/>}
            {copied ? 'Copied' : 'Copy BibTeX'}
        </button>
    )
}