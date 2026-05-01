import { useEffect, useRef } from "preact/hooks"

export default function Home() {
    const lines: string[] = []
    for (let index = 0; index < 50; index++) {
        lines.push(`Linha ${index + 1}`)
    }

    const heroHead = useRef<HTMLDivElement>(null)
    const heroBody = useRef<HTMLDivElement>(null)
    const divList = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (heroHead.current === null || heroBody.current === null || divList.current === null) return

        const height = heroHead.current!.clientHeight
        divList.current!.style.paddingTop = `${Math.ceil(height)}px`
        // const rObs = new ResizeObserver((entries) => {
        //     const entry = entries[0]
        //     const height = entry.contentRect.height - heroHead.current!.clientHeight
        //     console.log(height)
        //     divList.current!.style.height = `${Math.ceil(height)}px`
        // })

        // rObs.observe(globalThis.document.body)

        // return () => {
        //     rObs.disconnect()
        // }
    }, [])

    return (
        // <div class="container">
        //     <p class="title is-1">Rememore</p>
        //     <div class="buttons">
        //         <button type="button" class="button is-primary" onClick={() => globalThis.location.href = "/memorias"}>Memórias</button>
        //     </div>
        // </div>
        <>
            <div class="p-6 has-background-grey-dark is-fixed" ref={heroHead}>
                <p class="title is-4">Head</p>
            </div>
            <div class="has-background-black p-0" ref={heroBody}>
                <div class="has-background-grey has-overfow-y " ref={divList}>
                    {lines.map((line) => (
                        <>
                            <div>
                                <p>{line}</p>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}
