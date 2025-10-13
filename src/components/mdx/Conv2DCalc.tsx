'use client'

import { useMemo, useState } from 'react'
import { Copy, Plus, Trash2 } from 'lucide-react'

type Layer = {
    id: string
    kind: 'conv' | 'tconv'
    kH: number; kW: number
    sH: number; sW: number
    pH: number; pW: number
    dH: number; dW: number
    name?: string
}

function conv2dOut(h: number, w: number, L: Layer) {
    const Ho = Math.floor((h + 2*L.pH - L.dH*(L.kH - 1) - 1) / L.sH + 1)
    const Wo = Math.floor((w + 2*L.pW - L.dW*(L.kW - 1) - 1) / L.sW + 1)
    return { h: Math.max(Ho, 0), w: Math.max(Wo, 0) }
}

function tconv2dOut(h: number, w: number, L: Layer) {
    const Ho = (h - 1)*L.sH - 2*L.pH + L.dH*(L.kH - 1) + 1
    const Wo = (w - 1)*L.sW - 2*L.pW + L.dW*(L.kW - 1) + 1
    return { h: Math.max(Ho, 0), w: Math.max(Wo, 0) }
}

function newLayer(kind: Layer['kind'] = 'conv'): Layer {
    return {
        id: Math.random().toString(36).slice(2),
        kind,
        kH: 3, kW: 3,
        sH: 1, sW: 1,
        pH: 1, pW: 1,
        dH: 1, dW: 1,
        name: kind === 'conv' ? 'Conv2d' : 'ConvTranspose2d',
    }
}

export default function Conv2DCalc() {
    const [inH, setInH] = useState(224)
    const [inW, setInW] = useState(224)
    const [layers, setLayers] = useState<Layer[]>([newLayer('conv')])

    const rows = useMemo(() => {
        const log: { idx: number; name: string; kind: string; params: string; inH: number; inW: number; outH: number; outW: number }[] = []
        let h = inH, w = inW
        layers.forEach((L, i) => {
            const out = L.kind === 'conv' ? conv2dOut(h, w, L) : tconv2dOut(h, w, L)
            log.push({
                idx: i+1,
                name: L.name || (L.kind === 'conv' ? 'Conv2d' : 'ConvTranspose2d'),
                kind: L.kind,
                params: `k=${L.kH}×${L.kW}, s=${L.sH}×${L.sW}, p=${L.pH}×${L.pW}, d=${L.dH}×${L.dW}`,
                inH: h, inW: w, outH: out.h, outW: out.w
            })
            h = out.h; w = out.w
        })
        return { log, finalH: h, finalW: w }
    }, [inH, inW, layers])

    const copyLog = async () => {
        const lines = [
            `Input: ${inH}×${inW}`,
            ...rows.log.map(r => `L${r.idx} ${r.name}(${r.params}): ${r.inH}×${r.inW} → ${r.outH}×${r.outW}`),
            `Output: ${rows.finalH}×${rows.finalW}`
        ]
        await navigator.clipboard.writeText(lines.join('\n'))
    }

    const update = (id: string, patch: Partial<Layer>) =>
        setLayers(ls => ls.map(L => (L.id === id ? { ...L, ...patch } : L)))

    const remove = (id: string) => setLayers(ls => ls.filter(L => L.id !== id))
    const add = (kind: Layer['kind']) => setLayers(ls => [...ls, newLayer(kind)])

    return (
        <div className="not-prose rounded-xl border border-zinc-200 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="text-sm">Input H
                    <input type="number" className="mt-1 w-full rounded-md border px-2 py-1"
                           value={inH} onChange={e => setInH(+e.target.value || 0)} />
                </label>
                <label className="text-sm">Input W
                    <input type="number" className="mt-1 w-full rounded-md border px-2 py-1"
                           value={inW} onChange={e => setInW(+e.target.value || 0)} />
                </label>

                <button onClick={() => add('conv')} className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50">
                    <Plus className="h-4 w-4" /> Add Conv2d
                </button>
                <button onClick={() => add('tconv')} className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50">
                    <Plus className="h-4 w-4" /> Add ConvTranspose2d
                </button>
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-zinc-600">
                    <tr>
                        <th className="py-2 pr-3">#</th>
                        <th className="py-2 pr-3">Layer</th>
                        <th className="py-2 pr-3">Params</th>
                        <th className="py-2 pr-3">In (H×W)</th>
                        <th className="py-2 pr-3">Out (H×W)</th>
                        <th className="py-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {layers.map((L, i) => (
                        <tr key={L.id} className="align-top border-t">
                            <td className="py-2 pr-3">{i+1}</td>
                            <td className="py-2 pr-3">
                                <div className="flex gap-2">
                                    <select className="rounded-md border px-2 py-1"
                                            value={L.kind} onChange={e => update(L.id, { kind: e.target.value as Layer['kind'], name: e.target.value === 'conv' ? 'Conv2d' : 'ConvTranspose2d' })}>
                                        <option value="conv">Conv2d</option>
                                        <option value="tconv">ConvTranspose2d</option>
                                    </select>
                                    <input className="rounded-md border px-2 py-1 w-36" placeholder="Name" value={L.name ?? ''} onChange={e => update(L.id, { name: e.target.value })}/>
                                </div>
                            </td>
                            <td className="py-2 pr-3">
                                <div className="grid grid-cols-4 gap-2">
                                    <label className="col-span-2">kH
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.kH} onChange={e => update(L.id, { kH: +e.target.value || 0 })}/>
                                    </label>
                                    <label className="col-span-2">kW
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.kW} onChange={e => update(L.id, { kW: +e.target.value || 0 })}/>
                                    </label>
                                    <label className="col-span-2">sH
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.sH} onChange={e => update(L.id, { sH: +e.target.value || 0 })}/>
                                    </label>
                                    <label className="col-span-2">sW
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.sW} onChange={e => update(L.id, { sW: +e.target.value || 0 })}/>
                                    </label>
                                    <label className="col-span-2">pH
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.pH} onChange={e => update(L.id, { pH: +e.target.value || 0 })}/>
                                    </label>
                                    <label className="col-span-2">pW
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.pW} onChange={e => update(L.id, { pW: +e.target.value || 0 })}/>
                                    </label>
                                    <label className="col-span-2">dH
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.dH} onChange={e => update(L.id, { dH: +e.target.value || 0 })}/>
                                    </label>
                                    <label className="col-span-2">dW
                                        <input type="number" className="mt-1 w-full rounded-md border px-2 py-1" value={L.dW} onChange={e => update(L.id, { dW: +e.target.value || 0 })}/>
                                    </label>
                                </div>
                            </td>
                            <td className="py-2 pr-3 tabular-nums">
                                {(() => {
                                    const prev = rows.log[i-1]
                                    const inH2 = i === 0 ? inH : prev.outH
                                    const inW2 = i === 0 ? inW : prev.outW
                                    return `${inH2}×${inW2}`
                                })()}
                            </td>
                            <td className="py-2 pr-3 tabular-nums">
                                {(() => {
                                    const prev = rows.log[i-1]
                                    const inH2 = i === 0 ? inH : prev.outH
                                    const inW2 = i === 0 ? inW : prev.outW
                                    const out = L.kind === 'conv' ? conv2dOut(inH2, inW2, L) : tconv2dOut(inH2, inW2, L)
                                    return `${out.h}×${out.w}`
                                })()}
                            </td>
                            <td className="py-2">
                                <button onClick={() => remove(L.id)} className="inline-flex items-center rounded-md border px-2 py-1 hover:bg-zinc-50" title="Remove layer">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-zinc-600">Output: <span className="tabular-nums">{rows.finalH}×{rows.finalW}</span></div>
                <button onClick={copyLog} className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50">
                    <Copy className="h-4 w-4" /> Copy log
                </button>
            </div>
        </div>
    )
}