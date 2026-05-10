import { Signal } from "@preact/signals"
import { MemoryTab } from "@/app/services/memoria-page-service.ts"

interface IProps {
    tab: Signal<MemoryTab>
    allowNavigate: () => Promise<boolean>
    onNavigate: (tab: MemoryTab) => void
}

export default function MemoriaTabs(props: IProps) {
    const isCadastrar = props.tab.value === "cadastrar"
    const isCategorizar = props.tab.value === "categorizar"
    const isRevisar = props.tab.value === "revisar"

    const go = async (tab: MemoryTab) => {
        if (tab !== props.tab.value) {
            const allowNavigate = await props.allowNavigate()

            if (allowNavigate) {
                props.onNavigate(tab)
                props.tab.value = tab
            }
        }
    }

    return (
        <div class="tabs is-boxed is-centered mt-5">
            <ul>
                <li class={isCadastrar ? "is-active" : ""}>
                    <a onClick={() => go("cadastrar")}>
                        <span class="icon is-small">
                            <i class="fas fa-plus"></i>
                        </span>
                        <span>
                            Cadastrar
                        </span>
                    </a>
                </li>
                <li class={isCategorizar ? "is-active" : ""}>
                    <a onClick={() => go("categorizar")}>
                        <span class="icon is-small">
                            <i class="fas fa-list-ul"></i>
                        </span>
                        <span>
                            Categorizar
                        </span>
                    </a>
                </li>
                <li class={isRevisar ? "is-active is-disabled" : "is-disabled"}>
                    <a onClick={() => go("revisar")}>
                        <span class="icon is-small">
                            <i class="fas fa-eye"></i>
                        </span>
                        <span>
                            Revisar
                        </span>
                    </a>
                </li>
            </ul>
        </div>
    )
}
