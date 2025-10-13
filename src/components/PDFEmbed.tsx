import {withBase} from '@/lib/paths'

type Props = {
    src: string
    height?: number
    className?: string
    downloadLabel?: string
}

export default function PDFEmbed({src, height = 900, className, downloadLabel = 'Download PDF'}: Props) {
    const file = withBase(src)
    return (
        <div className={className}>
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <object data={file} type="application/pdf" width="100%" height={height}>
                    <div className="p-4 text-sm">
                        PDF preview isn’t supported in this browser.
                        {' '}
                        <a href={file} download className="link-underline">Download the file</a>
                        {' '}
                        to view it locally.
                    </div>
                </object>
                <div className="flex items-center justify-end gap-3 border-t bg-zinc-50 px-3 py-2">
                    <a href={file} download className="link-underline text-sm font-medium" title="Download PDF">
                        {downloadLabel}
                    </a>
                </div>
            </div>
        </div>
    )
}