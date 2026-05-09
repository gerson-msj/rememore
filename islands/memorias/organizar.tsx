import { useSignal } from "@preact/signals"
import MemoriaHeader from "@/components/memorias/header.tsx"
import MemoriaTabs, { MemoriaTab } from "@/components/memorias/tabs.tsx"
import Cadastrar from "@/islands/memorias/cadastrar.tsx"
import Categorizar from "@/islands/memorias/categorizar.tsx"
import Revisar from "@/islands/memorias/revisar.tsx"
import { Memoria } from "@/app/domain/memoria.ts"
import { useEffect, useRef } from "preact/hooks"
import { Message, MessageController } from "@/components/message.tsx"
import MemoriaIDBRepository from "@/app/data-context/idb/memoria-idb-repository.ts"

export default function Organizar() {
    const data = useSignal<string | undefined>(undefined)
    const models = useSignal<Memoria[]>([])
    const tab = useSignal<MemoriaTab>("cadastrar")

    const hasChanges = useSignal(false)
    const isEdit = useSignal(false)

    const messageRef = useRef(new MessageController())
    const memoriaRepositoryRef = useRef(new MemoriaIDBRepository())
    const headerRef = useRef<HTMLDivElement>(null)

    const message = messageRef.current
    const memoriaRepository = memoriaRepositoryRef.current

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

    const onNavigate = () => {
        isEdit.value = false
        hasChanges.value = false
    }

    useEffect(() => {
        loadValues()
    }, [])

    const loadValues = async () => {
        const storageDate = globalThis.localStorage.getItem("date")
        if (storageDate === null) {
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
                                onNavigate={() => onNavigate()}
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
