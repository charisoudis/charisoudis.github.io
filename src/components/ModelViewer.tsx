
'use client'
// Placeholder for your WebGL/R3F viewer.
// Replace with your own component or hook up React Three Fiber here.
export default function ModelViewer({ src }: { src: string }) {
  return (
    <div className="aspect-video w-full rounded-xl border border-dashed grid place-items-center text-sm">
      <p>3D Model Placeholder — src: {src}. Replace with your R3F viewer.</p>
    </div>
  )
}
