import { Categoria } from "@/app/domain/categoria.ts"
import { Signal, useSignal } from "@preact/signals"
import { createDeferred, Deferred, normalize } from "@/app/services/page-service.ts"
import { useRef } from "preact/hooks"
import { RefObject } from "preact"

interface PesquisaCategoriaData {
    isActive: boolean
    memoria: string
}

export class PesquisaCategoriaController {
    private _categorias: Signal<Categoria[]>
    public get categorias(): Signal<Categoria[]> {
        return this._categorias
    }

    private _data?: Signal<PesquisaCategoriaData>
    public get data(): Signal<PesquisaCategoriaData> {
        if (this._data === undefined) {
            throw new Error("Pesquisa Categoria Controller não inicializado")
        }
        return this._data
    }

    private _categoriasFiltradas?: Signal<Categoria[]>
    public get categoriasFiltradas(): Signal<Categoria[]> {
        if (this._categoriasFiltradas === undefined) {
            throw new Error("Pesquisa Categoria Controller não inicializado")
        }
        return this._categoriasFiltradas
    }

    private _deferred?: Deferred<Categoria | undefined>
    private _filterRef?: RefObject<HTMLInputElement>

    constructor(categorias: Signal<Categoria[]>) {
        this._categorias = categorias
    }

    initialize(data: Signal<PesquisaCategoriaData>, filterRef: RefObject<HTMLInputElement>, categoriasFiltradas: Signal<Categoria[]>) {
        this._data = data
        this._filterRef = filterRef
        this._categoriasFiltradas = categoriasFiltradas
    }

    open(memoria: string): Promise<Categoria | undefined> {
        if (this.data.peek().isActive === true) {
            throw Promise.reject("Já existe uma pesquisa em andamento.")
        }

        this.data.value = { isActive: true, memoria }
        this.categoriasFiltradas.value = [...this.categorias.peek()]
        if (this._filterRef?.current) {
            this._filterRef.current.value = ""
        }
        this._deferred = createDeferred<Categoria | undefined>()
        this._filterRef?.current?.focus()
        return this._deferred.promise
    }

    close(result?: Categoria) {
        if (this.data.peek().isActive === true) {
            this.data.value = { isActive: false, memoria: "" }
        }

        this._deferred?.resolve(result)
        this._deferred = undefined
    }
}

export default function PesquisaCategoria(props: { controller: PesquisaCategoriaController }) {
    const { controller } = props
    const filterRef = useRef<HTMLInputElement>(null)

    const data = useSignal<PesquisaCategoriaData>({ isActive: false, memoria: "" })
    const categoriasFiltradas = useSignal<Categoria[]>([])

    controller.initialize(data, filterRef, categoriasFiltradas)

    const pesquisar = (value: string) => {
        const source = controller.categorias.peek()

        if (value.trim().length === 0) {
            categoriasFiltradas.value = [...source]
            return
        }

        const result = source.filter((s) => normalize(s.categoria).includes(normalize(value)))
        if (result.length === 0) result.push({ id: 0, categoria: value })
        categoriasFiltradas.value = [...result]
    }

    return (
        <div class={`modal ${controller.data.value.isActive === true ? "is-active" : ""}`}>
            <div class="modal-background is-clickable" onClick={() => controller.close()}></div>
            <div class="modal-content">
                <div class="card">
                    <div class="card-content">
                        <div class="field">
                            <div class="control">
                                <label class="label">Categorias</label>
                                <div class="control has-icons-left">
                                    <input
                                        ref={filterRef}
                                        type="text"
                                        class="input"
                                        placeholder="Pesquisar"
                                        onInput={({ currentTarget: { value } }) => {
                                            pesquisar(value)
                                        }}
                                    />
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="control">
                                <aside class="menu">
                                    <ul class="menu-list overflow">
                                        {controller.categoriasFiltradas.value.map((categoria, index) => (
                                            <li
                                                key={index}
                                                class="is-clickable"
                                                onClick={() => controller.close(categoria)}
                                            >
                                                <a>{categoria.categoria}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </aside>
                            </div>

                            <div class="control">
                                <div class="notification is-pre-wrap">
                                    {controller.data.value.memoria}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
