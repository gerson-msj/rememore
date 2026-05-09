import { useEffect, useRef } from "preact/hooks"
import { Signal } from "@preact/signals"
import { RefObject } from "preact"
import { Memoria } from "@/app/domain/memoria.ts"

interface RevisarProps {
    data: string
    memorias: Signal<Memoria[]>
    parentHeaderRef: RefObject<HTMLDivElement>
}

export default function Revisar(props: RevisarProps) {
    const { data, parentHeaderRef } = props

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
                Revisar
            </div>
        </>
    )
}
