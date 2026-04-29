export default function Home() {
    return (
        <div class="container">
            <p class="title is-1">Rememore</p>
            <div class="buttons">
                <button type="button" class="button is-primary" onClick={() => globalThis.location.href = "/memorias"}>Memórias</button>
            </div>
        </div>
    )
}
