import { Signal, useSignal } from "@preact/signals"
import { Memoria } from "@/app/domain/memoria.ts"
import { useEffect, useRef } from "preact/hooks"
import { scrollDown } from "@/app/services/page-service.ts"
import { Message, MessageController } from "@/components/message.tsx"
import MemoriaIDBRepository from "@/app/data-context/idb/memoria-idb-repository.ts"
import { RefObject } from "preact"

interface CadastrarProps {
    data: string
    memorias: Signal<Memoria[]>
    parentHeaderRef: RefObject<HTMLDivElement>
}

export default function Cadastrar(props: CadastrarProps) {
    const { data, parentHeaderRef } = props

    const model = useSignal(new Memoria())
    const models = props.memorias
    const editIndex = useSignal<number | undefined>(undefined)
    const scrollInit = useSignal<number | undefined>(undefined)
    const hasChange = useSignal(false)

    const memoriaRef = useRef<HTMLTextAreaElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const messageRef = useRef(new MessageController())
    const memoriaRepositoryRef = useRef(new MemoriaIDBRepository())
    const editRefPrev = useRef<HTMLDivElement>(null)
    const editRef = useRef<HTMLDivElement>(null)
    const editRefNext = useRef<HTMLDivElement>(null)

    const message = messageRef.current
    const memoriaRepository = memoriaRepositoryRef.current
    const isEdit = editIndex.value !== undefined

    const salvar = async () => {
        const value: Memoria = { ...model.peek() }
        if (value.memoria.trim() === "") return

        const values = [...models.peek()]

        try {
            if (!isEdit) {
                value.data = data
                value.ordem = values.length === 0 ? 1 : Math.max(...values.map((v) => v.ordem)) + 1
                const newValues = [...models.peek(), value]
                await memoriaRepository.add(data, newValues)
                models.value = newValues
                scrollDown()
            } else {
                const values = [...models.peek()]
                const index = editIndex.value!
                const newValues = [
                    ...values.slice(0, index!),
                    value,
                    ...values.slice(index + 1)
                ]
                await memoriaRepository.add(data, newValues)
                models.value = newValues
                editIndex.value = undefined
            }

            model.value = new Memoria()
            hasChange.value = false
        } catch (error) {
            console.error("Erro ao salvar memória:", error)
            await message.open({ header: "Erro ao salvar a memória.", type: "is-danger" })
        } finally {
            memoriaRef.current?.focus()
        }
    }

    const remover = async () => {
        const index = editIndex.value!
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
            model.value = new Memoria()
            editIndex.value = undefined
            memoriaRef.current?.focus()
            hasChange.value = false
        } catch (error) {
            console.error("Erro ao remover memória:", error)
            await message.open({ header: "Erro ao remover a memória.", type: "is-danger" })
        }
    }

    const editar = (index: number) => {
        editIndex.value = index
        scrollInit.value = globalThis.scrollY
        const selected = models.peek()[index]
        model.value = { ...selected }
        memoriaRef.current?.focus()
        hasChange.value = false
    }

    const cancelarEditar = async () => {
        if (hasChange.value) {
            const result = await message.open({
                header: "Cancelar",
                body: "Confirma o cancelamento das alterações realizadas?",
                buttons: "okCancel"
            })
            if (result === "cancel") return
        }

        editIndex.value = undefined
        model.value = new Memoria()
        models.value = await memoriaRepository.getAll(data)
        memoriaRef.current?.focus()
        requestAnimationFrame(() => {
            globalThis.scrollTo({ top: scrollInit.value, behavior: "smooth" })
        })
    }

    const getEditRef = (index: number) => {
        if (editIndex.value === undefined) return undefined

        if (index === editIndex.value) {
            return editRef
        } else if (index === editIndex.value - 1) {
            return editRefPrev
        } else if (index === editIndex.value + 1) {
            return editRefNext
        } else {
            return undefined
        }
    }

    const up = () => mover(-1)

    const down = () => mover(1)

    const mover = (direction: -1 | 1) => {
        const index = editIndex.value!
        const targetIndex = index + direction
        const values = [...models.peek()]

        const current = { ...values[index], ordem: targetIndex + 1 }
        const target = { ...values[targetIndex], ordem: index + 1 }

        values[index] = target
        values[targetIndex] = current

        models.value = values
        model.value = { ...model.peek(), ordem: current.ordem }
        editIndex.value = targetIndex

        requestAnimationFrame(() => {
            const ref = (direction === -1 ? editRefPrev.current : editRefNext.current) ?? editRef.current
            const head = headerRef.current

            if (!ref || !head) return
            const smt = head.clientHeight + 15

            ref.style.scrollMarginTop = `${smt}px`
            ref.style.scrollMarginBottom = "12px"
            ref.scrollIntoView({ block: "nearest", behavior: "smooth" })
        })

        hasChange.value = true
    }

    const voltar = async () => {
        if (hasChange.value) {
            const result = await message.open({
                header: "Voltar",
                body: `Ao voltar, a ${isEdit ? "edição" : "inclusão"} em andamento será cancelada. \nDeseja voltar a página anterior?`,
                buttons: "okCancel"
            })
            if (result === "cancel") return
        }
        globalThis.location.href = "/memorias"
    }

    const allowNavigate = async (): Promise<boolean> => {
        if (hasChange.value) {
            const act = isEdit ? "edição" : "inclusão"
            const result = await message.open({
                header: `Memória em ${act}`,
                body: `Ao mudar de aba, a ${act} em andamento será cancelada. \nDeseja realizar a mudança de aba?`,
                buttons: "okCancel"
            })
            return result === "ok"
        }
        return true
    }

    useEffect(() => {
        memoriaRef.current?.focus()
        requestAnimationFrame(() => {
        })

        if (bodyRef.current !== null && headerRef.current !== null && parentHeaderRef.current !== null) {
            headerRef.current.style.top = `${parentHeaderRef.current.clientHeight}px`
            const bodyTop = parentHeaderRef.current.clientHeight + headerRef.current.clientHeight
            bodyRef.current.style.top = `${bodyTop + 3}px`
        }
        // loadValues()
    }, [])

    // const loadValues = async () => {
    //     const memorias = props.memorias ?? []
    //     try {
    //         if (memorias.length === 0) {
    //             models.value = await memoriaRepository.getAll(data.value)
    //         } else {
    //             const memoriasExistentes = await memoriaRepository.getAll(data.value)
    //             if (memoriasExistentes.length > 0) {
    //                 models.value = memoriasExistentes
    //             } else {
    //                 await memoriaRepository.add(data.value, memorias)
    //                 models.value = memorias
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Erro ao carregar memórias:", error)
    //         await message.open({
    //             header: "Erro ao carregar as memórias.",
    //             body: "Não foi possível manter as memórias neste navegador.",
    //             type: "is-danger"
    //         })
    //         globalThis.location.href = "/memorias"
    //     }
    // }

    return (
        <>
            {/* Header */}
            <div class="container is-fixed-sub is- p-3" ref={headerRef} style="z-index: 9">
                {/* Formulário de memórias */}
                <div class="field is-grouped is-align-items-end">
                    {/* Form */}
                    <div class="control is-expanded">
                        <label class="label">{`${isEdit ? "Editar" : "Incluir"} Memória`}</label>
                        <div class="control">
                            <textarea
                                class="textarea has-fixed-size"
                                placeholder="Descreva uma memória desta data."
                                value={model.value.memoria}
                                onInput={({ currentTarget: { value } }) => {
                                    model.value = { ...model.value, memoria: value }
                                    if (!isEdit) {
                                        hasChange.value = value.trim() !== ""
                                    }
                                }}
                                ref={memoriaRef}
                                onKeyDown={(event) => {
                                    if (event.ctrlKey && event.key === "Enter") {
                                        salvar()
                                        event.preventDefault()
                                    } else if (isEdit && event.key === "Escape") {
                                        cancelarEditar()
                                        event.preventDefault()
                                    }
                                }}
                            >
                            </textarea>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div class="control textarea-btns is-align-content-center">
                        <div class="buttons has-addons">
                            <button
                                type="button"
                                class="button"
                                onClick={() => salvar()}
                                title={`${isEdit ? "Salvar" : "Adicionar"}: CTRL+Enter`}
                            >
                                <span class="icon is-small">
                                    <i class={`fas ${isEdit ? "fa-save" : "fa-plus"}`}></i>
                                </span>
                            </button>
                            {isEdit && (
                                <>
                                    <button
                                        type="button"
                                        class="button"
                                        onClick={() => cancelarEditar()}
                                        title="Cancelar edição: Esc"
                                    >
                                        <span class="icon is-small">
                                            <i class="fas fa-ban"></i>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        class="button"
                                        onClick={() => remover()}
                                        title="Excluir"
                                    >
                                        <span class="icon is-small">
                                            <i class="fas fa-trash"></i>
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                        {isEdit && (
                            <>
                                <div class="buttons has-addons is-justify-content-center">
                                    <button
                                        type="button"
                                        class="button"
                                        disabled={editIndex.value === 0}
                                        onClick={() => up()}
                                        title="Mover para cima"
                                    >
                                        <span class="icon is-small">
                                            <i class="fas fa-angle-up"></i>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        class="button"
                                        disabled={editIndex.value! === models.value.length - 1}
                                        onClick={() => down()}
                                        title="Mover para baixo"
                                    >
                                        <span class="icon is-small">
                                            <i class="fas fa-angle-down"></i>
                                        </span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Lista de memórias */}
            <div class="container p-0 pr-3 pl-3" ref={bodyRef}>
                {/* Help */}
                {models.value.length === 0 && (
                    <>
                        <div class="container mt-5">
                            <div class="notification is-info is-dark">
                                <p class="mb-3">
                                    <b>Nenhuma memória foi cadastrada neste dia.</b>
                                </p>
                                <p>
                                    Para começar, escreva e organize suas memórias na aba
                                    <span class="icon is-small ml-2 mr-2">
                                        <i class="fas fa-plus"></i>
                                    </span>
                                    <b>Cadastrar</b>.
                                </p>
                                <p>
                                    Em seguida, estruture essas memórias em
                                    <span class="icon is-small ml-2 mr-2">
                                        <i class="fas fa-list-ul"></i>
                                    </span>
                                    <b>Categorizar</b>.
                                </p>
                                <p>
                                    Depois, confira se está tudo certo em
                                    <span class="icon is-small ml-2 mr-2">
                                        <i class="fas fa-eye"></i>
                                    </span>
                                    <b>Revisar</b>.
                                </p>
                                <p class="mt-3">
                                    Quando terminar a revisão, use o botão
                                    <span class="icon is-small ml-2 mr-2">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                    </span>
                                    <b>Guardar Memórias</b> para salvá-las para sempre.
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Lista */}
                {models.value.length > 0 && (
                    <div class="container p-3 m-0 has-background-black-ter has-radius-normal">
                        {models.value.map((model, index) => (
                            <div
                                ref={getEditRef(index)}
                                class={`field is-grouped is-align-items-center notification p-2 is-dark ${
                                    isEdit && editIndex.value === index ? "is-info is-dark" : ""
                                }`}
                                key={index}
                            >
                                <div class="control is-expanded pl-2 is-pre-wrap">
                                    {model.memoria}
                                </div>

                                <div class="buttons has-addons is-right">
                                    <button
                                        type="button"
                                        class="button"
                                        disabled={isEdit}
                                        onClick={() => editar(index)}
                                    >
                                        <span class="icon is-small">
                                            <i class="fas fa-edit"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Message controller={message} />
        </>
    )
}
