'use client'

import React, {useMemo, useState} from 'react'

type Num = number | ''

function parseIntOrEmpty(v: string): Num {
    if (v.trim() === '') return ''
    const n = Number.parseInt(v, 10)
    return Number.isFinite(n) ? n : ''
}

function conv2dOutSize(
    inSize: number,
    kernel: number,
    stride: number,
    padding: number,
    dilation: number
) {
    return Math.floor((inSize + 2 * padding - dilation * (kernel - 1) - 1) / stride + 1)
}

export default function Conv2DCalc() {
    const [H, setH] = useState<Num>('')
    const [W, setW] = useState<Num>('')

    const [kH, setKH] = useState<Num>(3)
    const [kW, setKW] = useState<Num>(3)

    const [sH, setSH] = useState<Num>(1)
    const [sW, setSW] = useState<Num>(1)

    const [pH, setPH] = useState<Num>(0)
    const [pW, setPW] = useState<Num>(0)

    const [dH, setDH] = useState<Num>(1)
    const [dW, setDW] = useState<Num>(1)

    const valid =
        H !== '' &&
        W !== '' &&
        kH !== '' &&
        kW !== '' &&
        sH !== '' &&
        sW !== '' &&
        pH !== '' &&
        pW !== '' &&
        dH !== '' &&
        dW !== ''

    const result = useMemo(() => {
        if (!valid) return null
        const outH = conv2dOutSize(H as number, kH as number, sH as number, pH as number, dH as number)
        const outW = conv2dOutSize(W as number, kW as number, sW as number, pW as number, dW as number)
        return {outH, outW}
    }, [H, W, kH, kW, sH, sW, pH, pW, dH, dW, valid])

    const logLine = useMemo(() => {
        if (!valid || !result) return ''
        return `H,W=${H}×${W} → k=${kH}×${kW}, s=${sH}×${sW}, p=${pH}×${pW}, d=${dH}×${dW} ⇒ H',W'=${result.outH}×${result.outW}`
    }, [H, W, kH, kW, sH, sW, pH, pW, dH, dW, result, valid])

    async function copyLog() {
        if (!logLine) return
        await navigator.clipboard.writeText(logLine)
    }

    return (
        <div className="not-prose rounded-xl border bg-white p-4 md:p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-kth-marine mb-3">Conv2D Dimensions Calculator</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Field label="Input H" value={H} onChange={setH}/>
                <Field label="Input W" value={W} onChange={setW}/>
                <Field label="Kernel H" value={kH} onChange={setKH}/>
                <Field label="Kernel W" value={kW} onChange={setKW}/>
                <Field label="Stride H" value={sH} onChange={setSH}/>
                <Field label="Stride W" value={sW} onChange={setSW}/>
                <Field label="Padding H" value={pH} onChange={setPH}/>
                <Field label="Padding W" value={pW} onChange={setPW}/>
                <Field label="Dilation H" value={dH} onChange={setDH}/>
                <Field label="Dilation W" value={dW} onChange={setDW}/>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="rounded-lg bg-kth-ivory px-3 py-2">
                    <div className="text-sm text-zinc-600">Output size</div>
                    <div className="font-semibold text-kth-marine text-lg">
                        {result ? `${result.outH} × ${result.outW}` : '—'}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={copyLog}
                    disabled={!logLine}
                    className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-kth-ivory disabled:opacity-50"
                    title="Copy a one-line summary to clipboard"
                >
                    Copy summary
                </button>
            </div>

            <div className="mt-3">
                <pre className="whitespace-pre-wrap text-xs bg-zinc-50 border rounded-md p-3">{logLine || '—'}</pre>
            </div>
        </div>
    )
}

function Field({label, value, onChange}: {
    label: string
    value: Num
    onChange: (n: Num) => void
}) {
    return (
        <label className="block">
            <span className="block text-xs text-zinc-600 mb-1">{label}</span>
            <input
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full rounded-md border px-2 py-1.5"
                value={value}
                onChange={(e) => onChange(parseIntOrEmpty(e.target.value))}
            />
        </label>
    )
}