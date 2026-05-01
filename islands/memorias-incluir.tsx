import { useSignal } from "@preact/signals"
import { Memoria, MemoriaData } from "@/app/domain/memoria.ts"
import { DateService } from "@/app/services/date-service.ts"
import { useEffect, useRef } from "preact/hooks"
import { scrollDown } from "@/app/services/page-service.ts"

export default function MemoriasIncluir(props: MemoriaData) {
    const data = props.data ?? DateService.dataLocal_ISOString()
    const model = useSignal(new Memoria())
    const models = useSignal(props.memorias ?? [])

    const memoriaRef = useRef<HTMLTextAreaElement>(null)
    const headRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)

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

        memoriaRef.current?.focus()
        scrollDown()
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
        for (let index = 0; index < 15; index++) {
            models.value = [...models.value, {
                data,
                memoria: `${index + 1}`,
                ordem: index + 1
            }]
        }

        memoriaRef.current?.focus()

        if (bodyRef.current !== null && headRef.current !== null) {
            bodyRef.current.style.top = `${headRef.current.clientHeight + 4}px`
        }
    }, [props])

    return (
        <div class="container">
            <div class="container is-fixed pb-3" ref={headRef}>
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

            <div
                class="container p-3 has-background-black-ter has-radius-normal"
                ref={bodyRef}
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
    )
}
