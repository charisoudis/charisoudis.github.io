import {Container} from './Container'

export function Footer() {
    return (
        <footer className="mt-16 bg-kth-marine text-white py-8">
            <Container>
                <div className="flex items-center justify-between">
                    <div className="text-white/90">
                        {'</>'} by Athanasios Charisoudis. Inspired by <a href="https://github.com/alshedivat/al-folio" target={"_blank"} rel="noreferrer">al-folio</a>
                    </div>
                </div>
            </Container>
        </footer>
    )
}