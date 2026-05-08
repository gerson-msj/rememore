import { DateService } from "@/app/services/date-service.ts"

interface MemoriaTitleProps {
    data: string
    onVoltar: () => void | Promise<void>
}

export default function MemoriaTitle(props: MemoriaTitleProps) {
    const title = `Memórias de ${DateService.dataFormatada(props.data)}`

    return (
        <div class="field is-grouped p-3">
            <div class="control">
                <p class="title is-4" onClick={() => props.onVoltar()}>
                    <span class="icon icon-btn is-clickable has-text-link">
                        <i class="fas fa-chevron-left"></i>
                    </span>
                </p>
            </div>
            <div class="control is-expanded">
                <p class="title is-4 has-text-link-light">{title}</p>
            </div>
        </div>
        // <nav class="navbar mt-2">
        //     <div class="navbar-menu">
        //         <div class="navbar-start ml-3">
        //             <div class="navbar-item">
        //                 <p class="title is-4 has-text-link-light">
        //                     <span class="icon icon-btn mr-3 has-text-link is-clickable" onClick={() => props.onVoltar()}>
        //                         <i class="fas fa-chevron-left"></i>
        //                     </span>
        //                     {title}
        //                 </p>
        //             </div>
        //         </div>
        //     </div>
        // </nav>
    )
}
