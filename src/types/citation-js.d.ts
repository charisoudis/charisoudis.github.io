declare module 'citation-js' {
    type Input = any
    type Options = Record<string, any>

    class Cite {
        constructor(data?: Input, options?: Options)

        add(data: Input): Cite

        format(style: string, options?: Options): string

        get(options?: Options): any[]

        data: any[]
    }

    export default Cite
}