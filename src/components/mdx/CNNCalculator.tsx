'use client'

import React, { useMemo, useState } from 'react'

type DimMode = '2d' | '3d'

type Size2 = { h: number; w: number }
type Size3 = { d: number; h: number; w: number }

type Layer2Type = 'Conv2d' | 'ConvTranspose2d' | '*Pool2d'
type Layer3Type = 'Conv3d' | 'ConvTranspose3d' | '*Pool3d'

type Layer =
    | {
    id: string
    dim: '2d'
    type: Layer2Type
    inC: number
    outC: number
    k: Size2
    s: Size2
    p: Size2
    op?: Size2
}
    | {
    id: string
    dim: '3d'
    type: Layer3Type
    inC: number
    outC: number
    k: Size3
    s: Size3
    p: Size3
    op?: Size3
}

function uid() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2)
}

function clampInt(v: number, min = 0, max = 99999) {
    if (!Number.isFinite(v)) return min
    return Math.max(min, Math.min(max, Math.trunc(v)))
}

function intInputProps(v: number, set: (n: number) => void, opts?: { min?: number; max?: number }) {
    return {
        value: v,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const n = Number.parseInt(e.currentTarget.value, 10)
            set(clampInt(n, opts?.min ?? 0, opts?.max ?? 99999))
        },
    }
}

function SmallInt({
                      value,
                      onChange,
                      min = 0,
                      max = 99999,
                      ariaLabel,
                      disabled,
                  }: {
    value: number
    onChange: (n: number) => void
    min?: number
    max?: number
    ariaLabel?: string
    disabled?: boolean
}) {
    return (
        <input
            type="number"
            className="w-20 rounded border px-2 py-1 text-center"
            disabled={disabled}
            aria-label={ariaLabel}
            {...intInputProps(value, onChange, { min, max })}
        />
    )
}

function Size2Input({
                        value,
                        onChange,
                        min = 0,
                        ariaLabel,
                        disabled,
                    }: {
    value: Size2
    onChange: (p: Size2) => void
    min?: number
    ariaLabel?: string
    disabled?: boolean
}) {
    return (
        <span className="inline-flex items-center gap-1">
      <input
          type="number"
          className="w-16 rounded border px-2 py-1 text-center"
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel} height` : undefined}
          {...intInputProps(value.h, (n) => onChange({ h: n, w: value.w }), { min })}
      />
      <span className="px-0.5">×</span>
      <input
          type="number"
          className="w-16 rounded border px-2 py-1 text-center"
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel} width` : undefined}
          {...intInputProps(value.w, (n) => onChange({ h: value.h, w: n }), { min })}
      />
    </span>
    )
}

function Size3Input({
                        value,
                        onChange,
                        min = 0,
                        ariaLabel,
                        disabled,
                    }: {
    value: Size3
    onChange: (p: Size3) => void
    min?: number
    ariaLabel?: string
    disabled?: boolean
}) {
    return (
        <span className="inline-flex items-center gap-1">
      <input
          type="number"
          className="w-16 rounded border px-2 py-1 text-center"
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel} depth` : undefined}
          {...intInputProps(value.d, (n) => onChange({ d: n, h: value.h, w: value.w }), { min })}
      />
      <span className="px-0.5">×</span>
      <input
          type="number"
          className="w-16 rounded border px-2 py-1 text-center"
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel} height` : undefined}
          {...intInputProps(value.h, (n) => onChange({ d: value.d, h: n, w: value.w }), { min })}
      />
      <span className="px-0.5">×</span>
      <input
          type="number"
          className="w-16 rounded border px-2 py-1 text-center"
          disabled={disabled}
          aria-label={ariaLabel ? `${ariaLabel} width` : undefined}
          {...intInputProps(value.w, (n) => onChange({ d: value.d, h: value.h, w: n }), { min })}
      />
    </span>
    )
}

function convOut1D(inSize: number, k: number, s: number, p: number, d = 1) {
    return Math.floor((inSize + 2 * p - d * (k - 1) - 1) / s + 1)
}

function convTOut1D(inSize: number, k: number, s: number, p: number, op = 0, d = 1) {
    return (inSize - 1) * s - 2 * p + d * (k - 1) + op + 1
}

function paramsConv2D(inC: number, outC: number, k: Size2) {
    return inC * outC * k.h * k.w
}

function paramsConv3D(inC: number, outC: number, k: Size3) {
    return inC * outC * k.d * k.h * k.w
}

function Badge({ children }: { children: React.ReactNode }) {
    return <span className="ml-2 rounded bg-kth-light/60 px-2 py-0.5 text-xs">{children}</span>
}

export default function CNNCalculator() {
    const [mode, setMode] = useState<DimMode>('2d')

    const [N, setN] = useState(1)
    const [C, setC] = useState(1)
    const [H, setH] = useState(28)
    const [W, setW] = useState(28)
    const [D, setD] = useState(16)

    const [newType2, setNewType2] = useState<Layer2Type>('Conv2d')
    const [newType3, setNewType3] = useState<Layer3Type>('Conv3d')

    const [layers, setLayers] = useState<Layer[]>([
        {
            id: uid(),
            dim: '2d',
            type: 'Conv2d',
            inC: 1,
            outC: 10,
            k: { h: 3, w: 3 },
            s: { h: 1, w: 1 },
            p: { h: 0, w: 0 },
        },
    ])

    function reset2D() {
        setN(1)
        setC(1)
        setH(28)
        setW(28)
        setLayers([
            {
                id: uid(),
                dim: '2d',
                type: 'Conv2d',
                inC: 1,
                outC: 10,
                k: { h: 3, w: 3 },
                s: { h: 1, w: 1 },
                p: { h: 0, w: 0 },
            },
        ])
    }

    function reset3D() {
        setN(1)
        setC(1)
        setD(16)
        setH(28)
        setW(28)
        setLayers([
            {
                id: uid(),
                dim: '3d',
                type: 'Conv3d',
                inC: 1,
                outC: 8,
                k: { d: 3, h: 3, w: 3 },
                s: { d: 1, h: 1, w: 1 },
                p: { d: 0, h: 0, w: 0 },
            },
        ])
    }

    function switchMode(next: DimMode) {
        if (next === mode) return
        setMode(next)
        if (next === '2d') reset2D()
        else reset3D()
    }

    function addLayer() {
        const last = layers[layers.length - 1]
        if (mode === '2d') {
            const prevOutC = last ? (last.dim === '2d' ? (last.type === '*Pool2d' ? last.inC : last.outC) : C) : C
            const L: Layer = {
                id: uid(),
                dim: '2d',
                type: newType2,
                inC: prevOutC,
                outC: newType2 === '*Pool2d' ? prevOutC : prevOutC,
                k: { h: 3, w: 3 },
                s: { h: 1, w: 1 },
                p: { h: 0, w: 0 },
                op: { h: 0, w: 0 },
            }
            setLayers((xs) => [...xs, L])
        } else {
            const prevOutC = last ? (last.dim === '3d' ? (last.type === '*Pool3d' ? last.inC : last.outC) : C) : C
            const L: Layer = {
                id: uid(),
                dim: '3d',
                type: newType3,
                inC: prevOutC,
                outC: newType3 === '*Pool3d' ? prevOutC : prevOutC,
                k: { d: 3, h: 3, w: 3 },
                s: { d: 1, h: 1, w: 1 },
                p: { d: 0, h: 0, w: 0 },
                op: { d: 0, h: 0, w: 0 },
            }
            setLayers((xs) => [...xs, L])
        }
    }

    function removeLayer(id: string) {
        setLayers((xs) => xs.filter((l) => l.id !== id))
    }

    function patchLayer(
      id: string,
      patch:
        | Partial<Omit<Extract<Layer, { dim: '2d' }>, 'dim'>>
        | Partial<Omit<Extract<Layer, { dim: '3d' }>, 'dim'>>
    ) {
      setLayers((xs) =>
        xs.map((l) => {
          if (l.id !== id) return l
          if (l.dim === '2d') {
            const p = patch as Partial<Omit<Extract<Layer, { dim: '2d' }>, 'dim'>>
            return { ...l, ...p }
          } else {
            const p = patch as Partial<Omit<Extract<Layer, { dim: '3d' }>, 'dim'>>
            return { ...l, ...p }
          }
        })
      )
    }

    type Snap2 = {
        in: { c: number; h: number; w: number }
        out: { c: number; h: number; w: number }
        ok: boolean
        error?: string
    }
    type Snap3 = {
        in: { c: number; d: number; h: number; w: number }
        out: { c: number; d: number; h: number; w: number }
        ok: boolean
        error?: string
    }

    const snaps = useMemo<(Snap2 | Snap3)[]>(() => {
        const out: (Snap2 | Snap3)[] = []
        if (mode === '2d') {
            let c = C
            let h = H
            let w = W
            for (const L of layers) {
                if (L.dim !== '2d') continue
                const inp = { c, h, w }
                let oc = c
                let oh = h
                let ow = w
                let ok = true
                let error: string | undefined

                const kOk = L.k.h >= 1 && L.k.w >= 1
                const sOk = L.s.h >= 1 && L.s.w >= 1
                const pOk = L.p.h >= 0 && L.p.w >= 0
                const opOk =
                    L.type !== 'ConvTranspose2d' || ((L.op?.h ?? 0) >= 0 && (L.op?.w ?? 0) >= 0 && (L.op!.h < L.s.h) && (L.op!.w < L.s.w))

                if (!kOk || !sOk || !pOk || !opOk) {
                    ok = false
                    error = 'Invalid hyperparameters'
                } else {
                    if (L.type === 'Conv2d' || L.type === '*Pool2d') {
                        oc = L.type === '*Pool2d' ? c : L.outC
                        oh = convOut1D(h, L.k.h, L.s.h, L.p.h)
                        ow = convOut1D(w, L.k.w, L.s.w, L.p.w)
                    } else {
                        oc = L.outC
                        oh = convTOut1D(h, L.k.h, L.s.h, L.p.h, L.op?.h ?? 0)
                        ow = convTOut1D(w, L.k.w, L.s.w, L.p.w, L.op?.w ?? 0)
                    }
                    if (oh <= 0 || ow <= 0) {
                        ok = false
                        error = 'Output size ≤ 0'
                    }
                }
                out.push({ in: inp, out: { c: oc, h: oh, w: ow }, ok, error })
                if (ok) {
                    c = oc
                    h = oh
                    w = ow
                }
            }
            return out
        } else {
            let c = C
            let d = D
            let h = H
            let w = W
            for (const L of layers) {
                if (L.dim !== '3d') continue
                const inp = { c, d, h, w }
                let oc = c
                let od = d
                let oh = h
                let ow = w
                let ok = true
                let error: string | undefined

                const kOk = L.k.d >= 1 && L.k.h >= 1 && L.k.w >= 1
                const sOk = L.s.d >= 1 && L.s.h >= 1 && L.s.w >= 1
                const pOk = L.p.d >= 0 && L.p.h >= 0 && L.p.w >= 0
                const opOk =
                    L.type !== 'ConvTranspose3d' ||
                    ((L.op?.d ?? 0) >= 0 &&
                        (L.op?.h ?? 0) >= 0 &&
                        (L.op?.w ?? 0) >= 0 &&
                        (L.op!.d < L.s.d) &&
                        (L.op!.h < L.s.h) &&
                        (L.op!.w < L.s.w))

                if (!kOk || !sOk || !pOk || !opOk) {
                    ok = false
                    error = 'Invalid hyperparameters'
                } else {
                    if (L.type === 'Conv3d' || L.type === '*Pool3d') {
                        oc = L.type === '*Pool3d' ? c : L.outC
                        od = convOut1D(d, L.k.d, L.s.d, L.p.d)
                        oh = convOut1D(h, L.k.h, L.s.h, L.p.h)
                        ow = convOut1D(w, L.k.w, L.s.w, L.p.w)
                    } else {
                        oc = L.outC
                        od = convTOut1D(d, L.k.d, L.s.d, L.p.d, L.op?.d ?? 0)
                        oh = convTOut1D(h, L.k.h, L.s.h, L.p.h, L.op?.h ?? 0)
                        ow = convTOut1D(w, L.k.w, L.s.w, L.p.w, L.op?.w ?? 0)
                    }
                    if (od <= 0 || oh <= 0 || ow <= 0) {
                        ok = false
                        error = 'Output size ≤ 0'
                    }
                }
                out.push({ in: inp, out: { c: oc, d: od, h: oh, w: ow }, ok, error })
                if (ok) {
                    c = oc
                    d = od
                    h = oh
                    w = ow
                }
            }
            return out
        }
    }, [mode, C, H, W, D, layers])

    const final2 = mode === '2d'
        ? (snaps[snaps.length - 1] as Snap2 | undefined)
        : undefined
    const final3 = mode === '3d'
        ? (snaps[snaps.length - 1] as Snap3 | undefined)
        : undefined

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-1xl md:text-2xl font-bold">CNN Dimensions Calculator</h2>
                    <p className="mt-2">
                        Live shape propagation for{' '}
                        <code>nn.Conv2d</code>, <code>nn.ConvTranspose2d</code>, <code>*Pool2d</code>{' '}
                        and{' '}
                        <code>nn.Conv3d</code>, <code>nn.ConvTranspose3d</code>, <code>*Pool3d</code>.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1 text-sm">
                    <input
                        type="radio"
                        name="dim"
                        className="h-5 w-5"
                        checked={mode === '2d'}
                        onChange={() => switchMode('2d')}
                    />
                    2D
                </label>
                <label className="inline-flex items-center gap-1 text-sm">
                    <input
                        type="radio"
                        name="dim"
                        className="h-5 w-5"
                        checked={mode === '3d'}
                        onChange={() => switchMode('3d')}
                    />
                    3D
                </label>
                <button
                    onClick={() => (mode === '2d' ? reset2D() : reset3D())}
                    type="button"
                    className="btn ml-auto"
                >
                    <span aria-hidden="true" className="mr-2">↻</span>
                    Reset
                </button>
            </div>

            {mode === '2d' ? (
                <div className="rounded-md border-2 border-black p-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
                        <span>(N, C, H, W)</span>
                        <span>
                            N=
                            <SmallInt value={N} onChange={setN} min={1} ariaLabel="Batch size N" />
                        </span>
                        <span>
                            C=
                            <SmallInt value={C} onChange={setC} min={1} ariaLabel="Channels C" />
                        </span>
                        <span className="inline-flex items-center gap-2">
                        H×W=
                        <Size2Input
                            value={{ h: H, w: W }}
                            onChange={(p) => {
                                setH(p.h)
                                setW(p.w)
                            }}
                            min={1}
                            ariaLabel="Input size"
                        />
                        </span>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border-2 border-black p-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
                        <span>(N, C, D, H, W)</span>
                        <span>
                            N=
                            <SmallInt value={N} onChange={setN} min={1} ariaLabel="Batch size N" />
                        </span>
                        <span>
                            C=
                            <SmallInt value={C} onChange={setC} min={1} ariaLabel="Channels C" />
                        </span>
                        <span className="inline-flex items-center gap-2">
                            D×H×W=
                            <Size3Input
                              value={{ d: D, h: H, w: W }}
                              onChange={(p) => {
                                  setD(p.d)
                                  setH(p.h)
                                  setW(p.w)
                              }}
                              min={1}
                              ariaLabel="Input size"
                            />
                        </span>
                    </div>
                </div>
            )}

            <div className="text-center text-4xl select-none">↓</div>

            <div className="space-y-6">
                {layers
                    .filter((l) => l.dim === mode)
                    .map((L, i, arr) => {
                        const s = snaps.filter((sn) => (mode === '2d' ? 'h' in (sn as any).in : 'd' in (sn as any).in))[i]
                        const prevOut =
                            i === 0
                                ? mode === '2d'
                                    ? { c: C, h: H, w: W }
                                    : { c: C, d: D, h: H, w: W }
                                : (snaps.filter((sn) => (mode === '2d' ? 'h' in (sn as any).in : 'd' in (sn as any).in))[
                                i - 1
                                    ] as any)?.out

                        return (
                            <div key={L.id} className="rounded-md border-2 border-black bg-[#eef0f7]">
                                <div className="flex items-center justify-between border-b-2 border-black px-3 py-2">
                                    <div className="text-sm font-medium">
                                        {L.type}
                                        {!(s as any)?.ok && (s as any)?.error ? <Badge>{(s as any).error}</Badge> : null}
                                    </div>
                                    <button onClick={() => removeLayer(L.id)} type="button" className="px-3 py-1 font-bold">
                                        ×
                                    </button>
                                </div>

                                <div className="p-3 space-y-3">
                                    {L.dim === '2d' ? (
                                        <div className="flex flex-wrap items-center gap-2 text-[15px] font-mono">
                                            <span>nn.{L.type} (</span>
                                            {L.type !== '*Pool2d' && (
                                                <>
                                                    <span>in_channels=</span>
                                                    <SmallInt value={L.inC} onChange={(v) => patchLayer(L.id, { inC: v })} min={1} ariaLabel="in channels" />
                                                    <span>,</span>
                                                    <span>out_channels=</span>
                                                    <SmallInt value={L.outC} onChange={(v) => patchLayer(L.id, { outC: v })} min={1} ariaLabel="out channels" />
                                                    <span>,</span>
                                                </>
                                            )}
                                            <span>kernel_size=</span>
                                            <Size2Input value={L.k} onChange={(v) => patchLayer(L.id, { k: v as any })} min={1} ariaLabel="kernel size" />
                                            <span>,</span>
                                            <span>stride=</span>
                                            <Size2Input value={L.s} onChange={(v) => patchLayer(L.id, { s: v as any })} min={1} ariaLabel="stride" />
                                            <span>,</span>
                                            <span>padding=</span>
                                            <Size2Input value={L.p} onChange={(v) => patchLayer(L.id, { p: v as any })} min={0} ariaLabel="padding" />
                                            {L.type === 'ConvTranspose2d' && (
                                                <>
                                                    <span>,</span>
                                                    <span>output_padding=</span>
                                                    <Size2Input value={L.op!} onChange={(v) => patchLayer(L.id, { op: v as any })} min={0} ariaLabel="output padding" />
                                                </>
                                            )}
                                            <span>)</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap items-center gap-2 text-[15px] font-mono">
                                            <span>nn.{L.type} (</span>
                                            {L.type !== '*Pool3d' && (
                                                <>
                                                    <span>in_channels=</span>
                                                    <SmallInt value={L.inC} onChange={(v) => patchLayer(L.id, { inC: v })} min={1} ariaLabel="in channels" />
                                                    <span>,</span>
                                                    <span>out_channels=</span>
                                                    <SmallInt value={L.outC} onChange={(v) => patchLayer(L.id, { outC: v })} min={1} ariaLabel="out channels" />
                                                    <span>,</span>
                                                </>
                                            )}
                                            <span>kernel_size=</span>
                                            <Size3Input value={L.k as Size3} onChange={(v) => patchLayer(L.id, { k: v as any })} min={1} ariaLabel="kernel size" />
                                            <span>,</span>
                                            <span>stride=</span>
                                            <Size3Input value={L.s as Size3} onChange={(v) => patchLayer(L.id, { s: v as any })} min={1} ariaLabel="stride" />
                                            <span>,</span>
                                            <span>padding=</span>
                                            <Size3Input value={L.p as Size3} onChange={(v) => patchLayer(L.id, { p: v as any })} min={0} ariaLabel="padding" />
                                            {L.type === 'ConvTranspose3d' && (
                                                <>
                                                    <span>,</span>
                                                    <span>output_padding=</span>
                                                    <Size3Input value={L.op as Size3} onChange={(v) => patchLayer(L.id, { op: v as any })} min={0} ariaLabel="output padding" />
                                                </>
                                            )}
                                            <span>)</span>
                                        </div>
                                    )}

                                    <div className="text-right leading-6">
                                        <div>
                                            IN:&nbsp;[
                                            {mode === '2d'
                                                ? `${(prevOut as any)?.c ?? '—'}, ${(prevOut as any)?.h ?? '—'}, ${(prevOut as any)?.w ?? '—'}`
                                                : `${(prevOut as any)?.c ?? '—'}, ${(prevOut as any)?.d ?? '—'}, ${(prevOut as any)?.h ?? '—'}, ${(prevOut as any)?.w ?? '—'}`}
                                            ]
                                        </div>
                                        <div className="whitespace-pre-wrap">
                                            {L.dim === '2d' ? (
                                                L.type === '*Pool2d' ? (
                                                    <>
                                                        POOL:&nbsp;F=({(L.k as Size2).h}, {(L.k as Size2).w}), S=({(L.s as Size2).h}, {(L.s as Size2).w}),
                                                        {' '}P=({(L.p as Size2).h}, {(L.p as Size2).w}), 0 params
                                                    </>
                                                ) : (
                                                    <>
                                                        {L.type === 'ConvTranspose2d' ? 'CONVT' : 'CONV'}:&nbsp;C<sub>IN</sub>={L.inC}, C<sub>OUT</sub>={L.outC}, F=({(L.k as Size2).h}, {(L.k as Size2).w}),
                                                        {' '}S=({(L.s as Size2).h}, {(L.s as Size2).w}), P=({(L.p as Size2).h}, {(L.p as Size2).w}),
                                                        {' '}{paramsConv2D(L.inC, L.outC, L.k as Size2).toLocaleString()} params
                                                    </>
                                                )
                                            ) : L.type === '*Pool3d' ? (
                                                <>
                                                    POOL:&nbsp;F=({(L.k as Size3).d}, {(L.k as Size3).h}, {(L.k as Size3).w}), S=({(L.s as Size3).d}, {(L.s as Size3).h}, {(L.s as Size3).w}),
                                                    {' '}P=({(L.p as Size3).d}, {(L.p as Size3).h}, {(L.p as Size3).w}), 0 params
                                                </>
                                            ) : (
                                                <>
                                                    {L.type === 'ConvTranspose3d' ? 'CONVT' : 'CONV'}:&nbsp;C<sub>IN</sub>={L.inC}, C<sub>OUT</sub>={L.outC},
                                                    {' '}F=({(L.k as Size3).d}, {(L.k as Size3).h}, {(L.k as Size3).w}),
                                                    {' '}S=({(L.s as Size3).d}, {(L.s as Size3).h}, {(L.s as Size3).w}),
                                                    {' '}P=({(L.p as Size3).d}, {(L.p as Size3).h}, {(L.p as Size3).w}),
                                                    {' '}{paramsConv3D(L.inC, L.outC, L.k as Size3).toLocaleString()} params
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            OUT:&nbsp;[
                                            {mode === '2d'
                                                ? ((s as Snap2)?.ok ? `${(s as Snap2).out.c}, ${(s as Snap2).out.h}, ${(s as Snap2).out.w}` : '—')
                                                : ((s as Snap3)?.ok ? `${(s as Snap3).out.c}, ${(s as Snap3).out.d}, ${(s as Snap3).out.h}, ${(s as Snap3).out.w}` : '—')}
                                            ]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_1fr] items-center gap-3">
                    <div className="hidden sm:block" />
                    <button type="button" className="btn h-[54px]" onClick={addLayer}>
                        add {mode === '2d' ? newType2 : newType3} layer
                    </button>
                    {mode === '2d' ? (
                        <select
                            className="h-[54px] rounded border px-2"
                            value={newType2}
                            onChange={(e) => setNewType2(e.currentTarget.value as Layer2Type)}
                        >
                            <option value="Conv2d">Conv2d</option>
                            <option value="ConvTranspose2d">ConvTranspose2d</option>
                            <option value="*Pool2d">*Pool2d</option>
                        </select>
                    ) : (
                        <select
                            className="h-[54px] rounded border px-2"
                            value={newType3}
                            onChange={(e) => setNewType3(e.currentTarget.value as Layer3Type)}
                        >
                            <option value="Conv3d">Conv3d</option>
                            <option value="ConvTranspose3d">ConvTranspose3d</option>
                            <option value="*Pool3d">*Pool3d</option>
                        </select>
                    )}
                    <div className="hidden sm:block" />
                </div>
            </div>

            <div className="text-center text-4xl select-none">↓</div>

            {mode === '2d' ? (
                <div className="rounded-md border-2 border-black p-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
                        <span>(N, C, H, W)</span>
                        <span>
                            N=
                            <SmallInt value={N} onChange={() => {}} min={1} disabled ariaLabel="Out N" />
                        </span>
                        <span>
                            C=
                            <SmallInt
                              value={final2?.ok ? (final2 as Snap2).out.c : C}
                              onChange={() => {}}
                              min={1}
                              disabled
                              ariaLabel="Out C"
                            />
                        </span>
                        <span className="inline-flex items-center gap-2">
                            H×W=
                            <Size2Input
                              value={{
                                  h: final2?.ok ? (final2 as Snap2).out.h : H,
                                  w: final2?.ok ? (final2 as Snap2).out.w : W,
                              }}
                              onChange={() => {}}
                              disabled
                              ariaLabel="Output size"
                            />
                        </span>
                    </div>
                </div>
            ) : (
                <div className="rounded-md border-2 border-black p-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg">
                        <span>(N, C, D, H, W)</span>
                        <span>
                            N=
                            <SmallInt value={N} onChange={() => {}} min={1} disabled ariaLabel="Out N" />
                        </span>
                        <span>
                            C=
                            <SmallInt
                              value={final3?.ok ? (final3 as Snap3).out.c : C}
                              onChange={() => {}}
                              min={1}
                              disabled
                              ariaLabel="Out C"
                            />
                        </span>
                        <span className="inline-flex items-center gap-2">
                            D×H×W=
                            <Size3Input
                              value={{
                                  d: final3?.ok ? (final3 as Snap3).out.d : D,
                                  h: final3?.ok ? (final3 as Snap3).out.h : H,
                                  w: final3?.ok ? (final3 as Snap3).out.w : W,
                              }}
                              onChange={() => {}}
                              disabled
                              ariaLabel="Output size"
                            />
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}