import { useEffect, useRef } from "preact/hooks"
import { Signal, useComputed } from "@preact/signals"
import { RefObject } from "preact"
import { Memoria } from "@/app/domain/memoria.ts"

interface RevisarProps {
    data: string
    memorias: Signal<Memoria[]>
    parentHeaderRef: RefObject<HTMLDivElement>
}

export default function Revisar(props: RevisarProps) {
    const { memorias, parentHeaderRef } = props

    const bodyRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    const podeGuardar = useComputed(() => memorias.value.length > 0 && memorias.value.every((m) => m.categoria !== undefined))

    useEffect(() => {
        if (bodyRef.current !== null && parentHeaderRef.current !== null) {
            const parentHeight = parentHeaderRef.current.clientHeight
            if (headerRef.current !== null) {
                headerRef.current.style.top = `${parentHeight}px`
                bodyRef.current.style.top = `${parentHeight + headerRef.current.clientHeight + 3}px`
            } else {
                bodyRef.current.style.top = `${parentHeight + 3}px`
            }
        }
    }, [])

    return (
        <>
            {memorias.value.length > 0 && (
                <div class="container is-fixed-sub p-3" ref={headerRef} style="z-index: 9">
                    <div class="field is-grouped is-justify-content-center">
                        <div class="control">
                            <button
                                type="button"
                                class="button is-success"
                                disabled={!podeGuardar.value}
                                title={!podeGuardar.value
                                    ? "Categorize todas as memórias antes de guardar."
                                    : "Salvar memórias permanentemente."}
                            >
                                <span class="icon is-small">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                </span>
                                <span>Guardar Memórias</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div class="container p-0 pr-3 pl-3" ref={bodyRef}>
                {memorias.value.length > 0 && (
                    <div class="container p-3 m-0 has-background-black-ter has-radius-normal">
                        {memorias.value.map((model, index) => (
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
                            </div>
                        ))}
                    </div>
                )}
                {memorias.value.length === 0 && (
                    <div class="notification is-warning is-dark m-3">
                        Nenhuma memória encontrada para revisar.
                    </div>
                )}
            </div>
        </>
    )
}
