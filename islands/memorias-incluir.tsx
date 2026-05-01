import { useSignal } from "@preact/signals"
import { Memoria, MemoriaData } from "@/app/domain/memoria.ts"
import { DateService } from "@/app/services/date-service.ts"
import { useEffect, useRef } from "preact/hooks"

export default function MemoriasIncluir(props: MemoriaData) {
    const data = props.data ?? DateService.dataLocal_ISOString()
    const model = useSignal(new Memoria())
    const models = useSignal(
        props.memorias ?? [
            { data, memoria: "Teste 1", ordem: 1 },
            { data, memoria: "Teste 2", ordem: 2 },
            { data, memoria: "Teste 3", ordem: 3 },
            { data, memoria: "Teste 4", ordem: 4 },
            { data, memoria: "Teste 5", ordem: 5 },
            { data, memoria: "Teste 6", ordem: 6 },
            { data, memoria: "Teste 7", ordem: 7 },
            { data, memoria: "Teste 8", ordem: 8 },
            { data, memoria: "Teste 9", ordem: 9 },
            { data, memoria: "Teste 10", ordem: 10 }
        ]
    )

    const memoriaRef = useRef<HTMLTextAreaElement>(null)
    const memoriasRef = useRef<HTMLDivElement>(null)

    const incluir = () => {
        const value: Memoria = { ...model.peek() }
        if (value.memoria.trim() === "") return

        const values = [...models.peek()]
        value.data = data
        value.ordem = values.length === 0 ? 1 : Math.max(...values.map((v) => v.ordem)) + 1
        models.value = [
            ...models.value,
            value
        ]
        model.value = { ...model.value, memoria: "" }

        setTimeout(() => {
            memoriaRef.current?.focus()
            memoriasRef.current?.scrollTo({ top: memoriasRef.current?.scrollHeight, behavior: "smooth" })
        }, 0)
    }

    const remover = (index: number) => {
        const values = [...models.peek()]
        const newValues = [
            ...values.slice(0, index),
            ...values.slice(index + 1)
        ]
        let ordem = 0
        newValues.forEach((v) => v.ordem = ++ordem)
        models.value = [...newValues]
    }

    useEffect(() => {
        memoriaRef.current?.focus()
    }, [props])

    return (
        <div class="container hero p-3 is-fullheight">
            <div class="hero-head">
                <p class="title is-3">Memórias de {DateService.dataFormatada(data)}</p>

                <button type="button" class="button mb-5" onClick={() => globalThis.location.href = "/memorias"}>
                    Voltar
                </button>

                <div class="field is-grouped is-align-items-end">
                    <div class="control is-expanded">
                        <label class="label">Memória</label>
                        <div class="control">
                            <textarea
                                class="textarea has-fixed-size"
                                placeholder="Descreva resumidamente um evento desta data."
                                value={model.value.memoria}
                                onInput={({ currentTarget: { value } }) => model.value = { ...model.value, memoria: value }}
                                ref={memoriaRef}
                                onKeyDown={(event) => {
                                    if (event.ctrlKey && event.key === "Enter") {
                                        incluir()
                                        event.preventDefault()
                                    }
                                }}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div class="control">
                        <div class="buttons has-addons is-right">
                            <button type="button" class="button" onClick={() => incluir()}>
                                <span class="icon is-small">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-body has-background-light p-0" style="align-items: stretch; display: flex; flex-direction: column;">
                <div
                    class="block memory-list p-3 has-background-black-ter has-radius-normal m-0 is-flex-grow-1"
                    style="overflow-y: auto;"
                    ref={memoriasRef}
                >
                    {models.value.map((model, index) => (
                        <div class="field is-grouped is-align-items-center notification is-dark p-2">
                            <div class="control is-expanded pl-2">
                                {model.memoria} - {model.ordem}
                            </div>

                            <div class="buttons has-addons is-right">
                                <button type="button" class="button" onClick={() => remover(index)}>
                                    <span class="icon is-small">
                                        <i class="fas fa-trash"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
