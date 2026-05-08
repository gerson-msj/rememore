import { useEffect, useRef } from "preact/hooks"
import { useSignal } from "@preact/signals"
import MemoriaTitle from "@/components/memorias/title.tsx"
import MemoriaTabs from "@/components/memorias/tabs.tsx"
import { getStorageDate } from "@/app/services/memoria-page-service.ts"

export default function Revisar() {
    const data = useSignal<string>("")

    const headRef = useRef<HTMLDivElement>(null)

    const voltar = () => {
        globalThis.location.href = "/memorias"
    }

    useEffect(() => {
        data.value = getStorageDate() ?? ""
        if (data.value === "") {
            voltar()
        }
    }, [])

    return (
        <>
            {data.value !== "" && (
                <>
                    <div class="container">
                        <div class="container is-fixed p-3 mt-3" ref={headRef}>
                            <MemoriaTitle dataMemoria={data.value} onVoltar={() => voltar()} />
                            <MemoriaTabs tab="revisar" />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
