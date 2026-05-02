import { useSignal } from "@preact/signals"
import { Memoria, MemoriaData } from "@/app/domain/memoria.ts"
import { DateService } from "@/app/services/date-service.ts"
import { useEffect, useRef } from "preact/hooks"
import { scrollDown } from "@/app/services/page-service.ts"
import { Message, MessageController } from "@/components/message.tsx"
import MemoriaIDBRepository from "@/app/data-context/idb/memoria-idb-repository.ts"

export default function MemoriasIncluir(props: MemoriaData) {
    const data = props.data ?? DateService.dataLocal_ISOString()
    const model = useSignal(new Memoria())
    const models = useSignal<Memoria[]>([])

    const memoriaRef = useRef<HTMLTextAreaElement>(null)
    const headRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const messageRef = useRef(new MessageController())
    const memoriaRepositoryRef = useRef(new MemoriaIDBRepository())

    const message = messageRef.current
    const memoriaRepository = memoriaRepositoryRef.current

    const incluir = async () => {
        const value: Memoria = { ...model.peek() }
        if (value.memoria.trim() === "") return

        const values = [...models.peek()]
        value.data = data
        value.ordem = values.length === 0 ? 1 : Math.max(...values.map((v) => v.ordem)) + 1

        try {
            const newModels = [...models.peek(), value]
            await memoriaRepository.add(data, newModels)

            models.value = newModels
            model.value = { ...model.value, memoria: "" }
            scrollDown()
        } catch (error) {
            console.error("Erro ao incluir memória:", error)
            await message.open({ header: "Erro ao incluir a memória.", type: "is-danger" })
        } finally {
            memoriaRef.current?.focus()
        }
    }

    const remover = async (index: number) => {
        const value = models.peek()[index]

        const messageResult = await message.open({
            header: "Deseja mesmo remover esta memória?",
            body: value.memoria,
            buttons: "okCancel"
        })

        if (messageResult === "cancel") return

        const values = [...models.peek()]
        const newValues = [
            ...values.slice(0, index),
            ...values.slice(index + 1)
        ]
        const finalValues = newValues.map((v, i) => ({ ...v, ordem: i + 1 }))

        try {
            await memoriaRepository.add(data, finalValues)
            models.value = finalValues
        } catch (error) {
            console.error("Erro ao remover memória:", error)
            await message.open({ header: "Erro ao remover a memória.", type: "is-danger" })
        }
    }

    useEffect(() => {
        memoriaRef.current?.focus()
        if (bodyRef.current !== null && headRef.current !== null) {
            bodyRef.current.style.top = `${headRef.current.clientHeight + 3}px`
        }
        loadValues()
    }, [props])

    const loadValues = async () => {
        const memorias = props.memorias ?? []
        try {
            if (memorias.length === 0) {
                models.value = await memoriaRepository.getAll(data)
            } else {
                const memoriasExistentes = await memoriaRepository.getAll(data)
                if (memoriasExistentes.length > 0) {
                    models.value = memoriasExistentes
                } else {
                    await memoriaRepository.add(data, memorias)
                    models.value = memorias
                }
            }
        } catch (error) {
            console.error("Erro ao carregar memórias:", error)
            await message.open({
                header: "Erro ao carregar as memórias.",
                body: "Não foi possível manter as memórias neste navegador.",
                type: "is-danger"
            })
            globalThis.location.href = "/memorias"
        }
    }

    return (
        <>
            <div class="container">
                <div class="container is-fixed p-3" ref={headRef}>
                    <p class="title is-3 mt-2 has-text-link-light">Memórias de {DateService.dataFormatada(data)}</p>

                    <button type="button" class="button mb-5" onClick={() => globalThis.location.href = "/memorias"}>
                        Voltar
                    </button>

                    <div class="field is-grouped is-align-items-end">
                        <div class="control is-expanded">
                            <label class="label">Memória</label>
                            <div class="control">
                                <textarea
                                    class="textarea has-fixed-size"
                                    placeholder="Descreva uma memória desta data."
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

                <div class="container p-0 pr-3 pl-3" ref={bodyRef}>
                    {models.value.length > 0 && (
                        <div class="container p-3 m-0 has-background-black-ter has-radius-normal">
                            {models.value.map((model, index) => (
                                <div class="field is-grouped is-align-items-center notification is-dark p-2" key={index}>
                                    <div class="control is-expanded pl-2 is-pre-wrap">
                                        {model.memoria}
                                    </div>

                                    <div class="buttons has-addons is-right">
                                        <button
                                            type="button"
                                            class="button"
                                            onClick={() =>
                                                remover(index)}
                                        >
                                            <span class="icon is-small">
                                                <i class="fas fa-trash"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Message controller={message} />
        </>
    )
}
