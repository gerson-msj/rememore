import { useEffect, useRef } from "preact/hooks"
import { Signal } from "@preact/signals"
import { RefObject } from "preact"
import { Memoria } from "@/app/domain/memoria.ts"

interface CategorizarProps {
    data: string
    memorias: Signal<Memoria[]>
    parentHeaderRef: RefObject<HTMLDivElement>
}

export default function Categorizar(props: CategorizarProps) {
    const { data, parentHeaderRef, memorias: models } = props

    const bodyRef = useRef<HTMLDivElement>(null)

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
                                    {model.memoria}
                                </div>

                                <div class="buttons has-addons is-right">
                                    <button
                                        type="button"
                                        class="button"
                                    >
                                        <span class="icon is-small">
                                            <i class="fas fa-plus-square"></i>
                                            {/* <i class="fas fa-check-square"></i> */}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
