import {defineDocumentType, makeSource} from 'contentlayer/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

export const Project = defineDocumentType(() => ({
    name: 'Project',
    filePathPattern: `projects/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: {type: 'string', required: true},
        description: {type: 'string', required: true},
        year: {type: 'number', required: false},
        tags: {type: 'list', of: {type: 'string'}},
        featured: {type: 'boolean', default: false},
        cover: {type: 'string', required: false},
        links: {type: 'json', required: false}
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.replace(/^projects\//, '')
        }
    }
}))

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

export default makeSource({
    contentDirPath: 'content',
    contentDirExclude: ['cv/**'],
    documentTypes: [Post, Project],
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
        ],
    },
})

