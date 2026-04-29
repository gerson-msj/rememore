import InputDate from "@/components/input-date.tsx"

export default function MemoriasIncluir() {
    return (
        <div class="container p-3">
            <p class="title is-3">Incluir Memórias</p>

            <button type="button" class="button mb-5" onClick={() => globalThis.location.href = "/memorias"}>
                Voltar
            </button>

            <div class="fixed-grid">
                <div class="grid">
                    <div class="cell is-row-span-2">
                        <div class="field">
                            <label class="label">Memória</label>
                            <div class="control">
                                <textarea
                                    class="textarea has-fixed-size"
                                    placeholder="Descreva resumidamente um evento desta data."
                                >
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <div class="cell">
                        <InputDate label="Data" class="input " />
                    </div>
                    <div class="cell">
                        <div class="buttons has-addons">
                            <button type="button" class="button">
                                <span class="icon is-small">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="field is-grouped notification">
                <div class="control is-expanded">
                    Memória<br />Memória<br />Memória
                </div>

                <div class="buttons has-addons is-right">
                    <button type="button" class="button">
                        <span class="icon is-small">
                            <i class="fas fa-trash"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
