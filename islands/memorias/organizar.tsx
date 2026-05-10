import { useSignal } from "@preact/signals"
import MemoriaHeader from "@/components/memorias/header.tsx"
import MemoriaTabs from "@/components/memorias/tabs.tsx"
import Cadastrar from "@/islands/memorias/cadastrar.tsx"
import Categorizar from "@/islands/memorias/categorizar.tsx"
import Revisar from "@/islands/memorias/revisar.tsx"
import { Memoria } from "@/app/domain/memoria.ts"
import { useEffect, useRef } from "preact/hooks"
import { Message, MessageController } from "@/components/message.tsx"
import MemoriaIDBRepository from "@/app/data-context/idb/memoria-idb-repository.ts"
import { getStorageDate, getStorageTab, MemoryTab, setStorageTab } from "@/app/services/memoria-page-service.ts"
import CategoriaIDBRepository from "@/app/data-context/idb/categoria-idb-repository.ts"
import { Categoria } from "@/app/domain/categoria.ts"

export default function Organizar() {
    const data = useSignal<string | undefined>(undefined)
    const models = useSignal<Memoria[]>([])
    const categorias = useSignal<Categoria[]>([])
    const tab = useSignal<MemoryTab>("cadastrar")

    const hasChanges = useSignal(false)
    const isEdit = useSignal(false)

    const messageRef = useRef(new MessageController())
    const memoriaRepositoryRef = useRef(new MemoriaIDBRepository())
    const categoriaRepositoryRef = useRef(new CategoriaIDBRepository())
    const headerRef = useRef<HTMLDivElement>(null)

    const message = messageRef.current
    const memoriaRepository = memoriaRepositoryRef.current
    const categoriaRepository = categoriaRepositoryRef.current

    const voltar = async () => {
        if (hasChanges.value || isEdit.value) {
            const result = await message.open({
                header: "Voltar",
                body: `Ao voltar, a ${
                    isEdit.value ? "edição" : "inclusão"
                } em andamento será cancelada. \nDeseja voltar a página anterior?`,
                buttons: "okCancel"
            })
            if (result === "cancel") return
        }
        globalThis.location.href = "/memorias"
    }

    const allowNavigate = async () => {
        if (hasChanges.value || isEdit.value) {
            const act = isEdit ? "edição" : "inclusão"
            const result = await message.open({
                header: `Memória em ${act}`,
                body: `Ao mudar de aba, a ${act} em andamento será cancelada. \nDeseja mudar de aba?`,
                buttons: "okCancel"
            })
            return result === "ok"
        }
        return true
    }

    const onNavigate = (tab: MemoryTab) => {
        isEdit.value = false
        hasChanges.value = false
        setStorageTab(tab)
    }

    useEffect(() => {
        loadValues()
    }, [])

    const loadValues = async () => {
        const storageDate = getStorageDate()
        if (storageDate === undefined) {
            voltar()
            return
        }

        try {
            const memoriasExistentes = await memoriaRepository.getAll(storageDate)
            if (memoriasExistentes.length > 0) {
                models.value = memoriasExistentes
            } else {
                /**
                 * Buscar memórias na API
                 * Armazenar as memórias da API localmente
                 */
                models.value = []
            }

            const categoriasExistentes = await categoriaRepository.getAll()
            if (categoriasExistentes.length > 0) {
                categorias.value = categoriasExistentes
            } else {
                /**
                 * Buscar categorias na API
                 * Armazenar as categorias da API localmente
                 */
                categorias.value = [
                    { id: 1, categoria: "Tarefas de casa" },
                    { id: 2, categoria: "Leitura" },
                    { id: 3, categoria: "Estudo" }
                ]
            }

            const storageTab: MemoryTab = models.value.length === 0 ? "cadastrar" : getStorageTab() ?? "cadastrar"

            tab.value = storageTab
            data.value = storageDate
        } catch (error) {
            console.error("Erro ao carregar memórias:", error)
            await message.open({
                header: "Erro ao carregar as memórias.",
                body: "Não foi possível manter as memórias neste navegador.",
                type: "is-danger"
            })
            voltar()
        }
    }

    return (
        <>
            {data.value === undefined && <MemoriaHeader isLoading />}

            {data.value !== undefined && (
                <>
                    <div class="container">
                        {/* Header */}
                        <div class="container is-fixed" ref={headerRef}>
                            <MemoriaHeader data={data.value} onVoltar={() => voltar()} />
                            <MemoriaTabs
                                tab={tab}
                                onNavigate={(tab) => onNavigate(tab)}
                                allowNavigate={() => allowNavigate()}
                            />
                        </div>

                        {tab.value === "cadastrar" && (
                            <Cadastrar
                                data={data.value}
                                memorias={models}
                                parentHeaderRef={headerRef}
                                hasChanges={hasChanges}
                                isEdit={isEdit}
                            />
                        )}

                        {tab.value === "categorizar" && (
                            <Categorizar
                                data={data.value}
                                memorias={models}
                                parentHeaderRef={headerRef}
                            />
                        )}

                        {tab.value === "revisar" && (
                            <Revisar
                                data={data.value}
                                memorias={models}
                                parentHeaderRef={headerRef}
                            />
                        )}
                    </div>
                    <Message controller={messageRef.current} />
                </>
            )}
        </>
    )
}
