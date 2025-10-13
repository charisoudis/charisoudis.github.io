import {withBase} from '@/lib/paths'
import {Github, FileDown, Code} from 'lucide-react'

function isExternal(url: string) {
    return /^https?:\/\//i.test(url)
}

export default function ProjectLinks({codeUrl, report, reportLabel = 'Download PDF'}: {
    codeUrl?: string
    report?: string
    reportLabel?: string
}) {
    return (
        <div className="flex items-center gap-3">
            {codeUrl ? (
                <a
                    href={codeUrl}
                    target={isExternal(codeUrl) ? '_blank' : undefined}
                    rel={isExternal(codeUrl) ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-1 link-underline text-sm font-semibold"
                    title="View code repository"
                >
                    {codeUrl.includes('github.com') ? <Github className="h-4 w-4"/> : <Code className="h-4 w-4"/>}
                    <span>Code</span>
                </a>
            ) : null}

            {report ? (
                <a
                    href={withBase(report)}
                    download
                    className="inline-flex items-center gap-1 link-underline text-sm font-semibold"
                    title="Download report (PDF)"
                >
                    <FileDown className="h-4 w-4"/>
                    <span>{reportLabel}</span>
                </a>
            ) : null}
        </div>
    )
}