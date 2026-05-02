export default function MemoriasHome() {
    return (
        <div class="container">
            <p class="title is-1">Memórias</p>
            <div class="buttons">
                <button type="button" class="button is-primary" onClick={() => globalThis.location.href = "/memorias/incluir"}>
                    Incluir Memórias
                </button>
            </div>
        </div>
    )
}
