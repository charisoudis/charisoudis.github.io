'use client'

import dynamic from 'next/dynamic'

const Calc = dynamic(() => import('./Conv2DCalc'), { ssr: false })

export default function Conv2DCalcClient() {
    return <Calc />
}