import {defineDocumentType, makeSource} from 'contentlayer/source-files'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

export const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: `posts/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: {type: 'string', required: true},
        date: {type: 'date', required: true},
        summary: {type: 'string', required: false},
        image: {type: 'string', required: false},
        tags: {type: 'list', of: {type: 'string'}, required: false},
        draft: {type: 'boolean', default: false},
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.replace(/^posts\//, ''),
        },
        url: {
            type: 'string',
            resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^posts\//, '')}`,
        },
    },
}))


const Project = defineDocumentType(() => ({
    name: 'Project',
    filePathPattern: `projects/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: {type: 'string', required: true},
        date: {type: 'date', required: true},
        summary: {type: 'string', required: false},
        authors: {type: 'list', of: {type: 'string'}, required: false},
        supervisor: {type: 'string', required: false},
        projectType: {type: 'string', required: false},
        year: {type: 'string', required: false},
        tags: {type: 'list', of: {type: 'string'}, required: false},
        featured: {type: 'boolean', required: false},
        codeUrl: {type: 'string', required: false},
        image: {type: 'string', required: false},
        imageAlt: {type: 'string', required: false},
        hero: {type: 'string', required: false},
        heroAlt: {type: 'string', required: false},
        report: {type: 'string', required: false},
    },
    computedFields: {
        slug: {type: 'string', resolve: (doc) => doc._raw.flattenedPath.replace(/^projects\//, '')},
    },
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Post, Project],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
    },
})