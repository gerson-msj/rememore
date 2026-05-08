import { useSignal } from "@preact/signals"
import MemoriaTitle from "@/components/memorias/title.tsx"
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

    const messageRef = useRef(new MessageController())
    const memoriaRepositoryRef = useRef(new MemoriaIDBRepository())
    const headerRef = useRef<HTMLDivElement>(null)

    const message = messageRef.current
    const memoriaRepository = memoriaRepositoryRef.current

    const voltar = () => {
        globalThis.location.href = "/memorias"
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
            {data.value === undefined && (
                <>
                    <div class="container">
                        <div class="field is-grouped p-3">
                            <div class="control">
                                <p class="title is-4">
                                    <span class="icon has-text-link">
                                        <i class="fas fa-cloud"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="control is-expanded">
                                <p class="title is-4 has-text-link-light">Memórias</p>
                            </div>
                            <div class="control">
                                <button
                                    type="button"
                                    class="button is-loading"
                                    title="Sair"
                                >
                                    <span class="icon">
                                        <i class="fas fa-sign-out-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {data.value !== undefined && (
                <>
                    <div class="container">
                        {/* Header */}
                        <div class="container is-fixed" ref={headerRef}>
                            <MemoriaTitle data={data.value} onVoltar={() => voltar()} />
                            <MemoriaTabs tab={tab} />
                        </div>

                        {tab.value === "cadastrar" && (
                            <Cadastrar
                                data={data.value}
                                memorias={models}
                                parentHeaderRef={headerRef}
                            />
                        )}

                        {tab.value === "categorizar" && <Categorizar />}

                        {tab.value === "revisar" && <Revisar />}
                    </div>
                    <Message controller={messageRef.current} />
                </>
            )}
        </>
    )
}
