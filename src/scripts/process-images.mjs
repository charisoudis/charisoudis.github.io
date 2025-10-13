import fg from 'fast-glob'
import fs from 'fs-extra'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'content/media/originals')
const OUT_DIR = path.join(ROOT, 'public/media')
const MANIFEST_PATH = path.join(ROOT, 'src/data/image-manifest.json')

const WIDTHS_DEFAULT = [160, 320, 640, 960, 1280]
const WIDTHS_ICON = [24, 32, 36, 40, 48, 64, 72]

const FORMATS_OPAQUE = ['avif', 'webp', 'jpg']
const FORMATS_ALPHA = ['avif', 'webp', 'png']

const isIcon = (rel) => rel.startsWith('interests/')

async function main() {
    const files = await fg(['**/*.{jpg,jpeg,png}', '!**/_*.*'], {cwd: SRC_DIR})
    const manifest = {}

    await fs.ensureDir(OUT_DIR)

    for (const rel of files) {
        const srcPath = path.join(SRC_DIR, rel)
        const id = rel.replace(/\.(jpg|jpeg|png)$/i, '')
        const outBaseDir = path.join(OUT_DIR, id)
        await fs.ensureDir(outBaseDir)

        const base = sharp(srcPath)
        const meta = await base.metadata()
        const aspect = (meta.width && meta.height) ? meta.width / meta.height : undefined
        const hasAlpha = Boolean(meta.hasAlpha)

        const widths = isIcon(rel) ? WIDTHS_ICON : WIDTHS_DEFAULT
        const formats = hasAlpha ? FORMATS_ALPHA : FORMATS_OPAQUE

        manifest[id] = {
            width: meta.width || null,
            height: meta.height || null,
            aspect,
            variants: {} // [{w, src}, ...]
        }

        for (const format of formats) {
            manifest[id].variants[format] = []

            for (const w of widths) {
                if (meta.width && w > meta.width)
                    continue

                const outName = `${w}.${format}`
                const outFile = path.join(outBaseDir, outName)
                const pipeline = sharp(srcPath).resize({width: w, withoutEnlargement: true})

                if (format === 'webp') pipeline.webp({quality: isIcon(rel) ? 80 : 82, effort: 4})
                if (format === 'avif') pipeline.avif({quality: isIcon(rel) ? 48 : 55, effort: 4})
                if (format === 'jpg') pipeline.jpeg({quality: 84, mozjpeg: true})
                if (format === 'png') pipeline.png({compressionLevel: 9, palette: true})

                await pipeline.toFile(outFile)
                manifest[id].variants[format].push({w, src: `/media/${id}/${outName}`})
            }

            if (manifest[id].variants[format].length === 0) {
                const outName = `orig.${format}`
                const outFile = path.join(outBaseDir, outName)
                const pipeline = sharp(srcPath)
                if (format === 'webp') pipeline.webp({quality: 82})
                if (format === 'avif') pipeline.avif({quality: 55})
                if (format === 'jpg') pipeline.jpeg({quality: 84, mozjpeg: true})
                if (format === 'png') pipeline.png({compressionLevel: 9, palette: true})
                await pipeline.toFile(outFile)
                manifest[id].variants[format].push({w: meta.width || 0, src: `/media/${id}/${outName}`})
            }
        }
    }

    await fs.ensureDir(path.dirname(MANIFEST_PATH))
    await fs.writeJSON(MANIFEST_PATH, manifest, {spaces: 2})
    console.log(`✔ Wrote manifest with ${Object.keys(manifest).length} entries`)
}

main().catch((e) => {
    console.error(e);
    process.exit(1)
})