import { DateService } from "@/app/services/date-service.ts"

interface MemoriaTitleProps {
    data?: string
    onVoltar?: () => void | Promise<void>
    onSair?: () => void | Promise<void>
    isLoading?: boolean
}

export default function MemoriaHeader(props: MemoriaTitleProps) {
    const title = props.data === undefined ? "Memórias" : `Memórias de ${DateService.dataFormatada(props.data)}`
    const isLoading = props.isLoading ?? false

    return (
        <div class="field is-grouped p-3">
            <div class="control">
                {props.onVoltar === undefined && (
                    <p class="title is-4">
                        <span class="icon has-text-link">
                            <i class="fas fa-cloud"></i>
                        </span>
                    </p>
                )}
                {props.onVoltar !== undefined && (
                    <p class="title is-4" onClick={() => props.onVoltar!()}>
                        <span class="icon icon-btn is-clickable has-text-link">
                            <i class="fas fa-chevron-left"></i>
                        </span>
                    </p>
                )}
            </div>
            <div class="control is-expanded">
                <p class="title is-4 has-text-link-light">
                    {title}
                </p>
            </div>
            {(props.onSair !== undefined || isLoading) && (
                <div class="control">
                    <button
                        type="button"
                        class={`button ${isLoading ? "is-loading" : ""}`}
                        title={`${!isLoading ? "Sair" : ""}`}
                        onClick={() => {
                            if (!isLoading && props.onSair) {
                                props.onSair()
                            }
                        }}
                    >
                        <span class={`icon ${!isLoading ? "has-text-danger-dark-invert" : ""}`}>
                            <i class="fas fa-sign-out-alt"></i>
                        </span>
                    </button>
                </div>
            )}
        </div>
    )
}
