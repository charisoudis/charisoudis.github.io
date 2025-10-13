export function Section({title, children}: { title: string, children: React.ReactNode }) {
    return (
        <section className="mt-8 md:mt-10">
            <h2 className="text-1xl md:text-2xl font-semibold mb-5">{title}</h2>
            <div className="grid gap-6">
                {children}
            </div>
        </section>
    )
}