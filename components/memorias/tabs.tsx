import { Signal } from "@preact/signals"

export type MemoriaTab = "cadastrar" | "categorizar" | "revisar"

interface IProps {
    tab: Signal<MemoriaTab>
    allowNavigate: () => Promise<boolean>
    onNavigate: () => void
}

export default function MemoriaTabs(props: IProps) {
    const isCadastrar = props.tab.value === "cadastrar"
    const isCategorizar = props.tab.value === "categorizar"
    const isRevisar = props.tab.value === "revisar"

    const go = async (tab: MemoriaTab) => {
        if (tab !== props.tab.value) {
            const allowNavigate = await props.allowNavigate()

            if (allowNavigate) {
                props.onNavigate()
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
