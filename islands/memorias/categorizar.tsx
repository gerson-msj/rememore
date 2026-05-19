import { useEffect, useRef } from "preact/hooks"
import { Signal } from "@preact/signals"
import { RefObject } from "preact"
import { Memoria } from "@/app/domain/memoria.ts"
import { Categoria } from "@/app/domain/categoria.ts"
import PesquisaCategoria, { PesquisaCategoriaController } from "@/components/pesquisa-categoria.tsx"
import memorias from "@/routes/memorias/index.tsx"
import CategoriaIDBRepository from "@/app/data-context/idb/categoria-idb-repository.ts"

interface CategorizarProps {
    data: string
    memorias: Signal<Memoria[]>
    categorias: Signal<Categoria[]>
    parentHeaderRef: RefObject<HTMLDivElement>
}

export default function Categorizar(props: CategorizarProps) {
    const { data, categorias, parentHeaderRef, memorias: models } = props

    const pesquisaControllerRef = useRef(new PesquisaCategoriaController(categorias))
    const categoriaRepositoryRef = useRef(new CategoriaIDBRepository())

    const bodyRef = useRef<HTMLDivElement>(null)
    const pesquisaController = pesquisaControllerRef.current
    const categoriaRepository = categoriaRepositoryRef.current

    const categorizar = async (index: number) => {
        const currentModels = models.peek()
        const model = { ...currentModels[index] }
        const categoria = await pesquisaController.open(model.memoria)
        if (categoria === undefined) return
        models.value = [
            ...currentModels.slice(0, index),
            { ...model, categoria },
            ...currentModels.slice(index + 1)
        ]

        const atualizarCategorias = await categoriaRepository.add(categoria)
        if (atualizarCategorias) {
            categorias.value = await categoriaRepository.getAll()
        }
    }

    useEffect(() => {
        if (bodyRef.current !== null && parentHeaderRef.current !== null) {
            const bodyTop = parentHeaderRef.current.clientHeight
            bodyRef.current.style.top = `${bodyTop + 3}px`
        }
    }, [])

    return (
        <>
            <div class="container p-0 pr-3 pl-3" ref={bodyRef}>
                {models.value.length > 0 && (
                    <div class="container p-3 m-0 has-background-black-ter has-radius-normal">
                        {models.value.map((model, index) => (
                            <div
                                class="field is-grouped is-align-items-center notification p-2 is-dark"
                                key={index}
                            >
                                <div class="control is-expanded pl-2 is-pre-wrap">
                                    {model.categoria && (
                                        <b>
                                            {model.categoria.categoria}:
                                            <br />
                                        </b>
                                    )}
                                    {model.memoria}
                                </div>

                                <div class="buttons has-addons is-right">
                                    <button
                                        type="button"
                                        class="button"
                                        onClick={() => categorizar(index)}
                                    >
                                        <span class="icon is-small">
                                            <i class={`fas ${model.categoria === undefined ? "fa-plus-square" : "fa-check-square"}`}></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {models.value.length === 0 && (
                    <div class="notification is-warning is-dark m-3">
                        Nenhuma memória encontrada para categorizar.
                    </div>
                )}
            </div>
            <PesquisaCategoria controller={pesquisaController} />
        </>
    )
}
