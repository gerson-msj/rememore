import { useSignal } from "@preact/signals"
import { DateService } from "@/app/services/date-service.ts"
import { useRef } from "preact/hooks"

export default function MemoriasHome() {
    const data = useSignal(DateService.dataLocal_ISOString())
    const dtRef = useRef<HTMLInputElement>(null)

    const organizar = () => {
        globalThis.localStorage.setItem("date", data.value)
        globalThis.location.href = "/memorias/organizar"
    }

    return (
        <div class="container">
            <div class="field is-grouped p-3">
                <div class="control">
                    <p class="title is-4">
                        <span class="icon has-text-link is-loading">
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
                        class="button"
                        title="Sair"
                    >
                        <span class="icon has-text-danger-dark-invert">
                            <i class="fas fa-sign-out-alt"></i>
                        </span>
                    </button>
                </div>
            </div>

            <div class="field is-grouped is-justify-content-center mt-5">
                <div class="control">
                    <div class="field has-addons is-align-items-end">
                        <div class="control is-expanded">
                            <input
                                type="date"
                                ref={dtRef}
                                class={`input ${data.value === "" ? "is-placeholder" : ""} has-text-centered`}
                                value={data.value}
                                onInput={({ currentTarget: { value } }) => {
                                    data.value = value
                                }}
                            />
                        </div>
                        <div class="control">
                            <button
                                type="button"
                                class="button"
                                onClick={() => dtRef.current?.showPicker()}
                            >
                                <span class="icon is-small">
                                    <i class="fas fa-calendar"></i>
                                </span>
                            </button>
                        </div>
                        <div class="control">
                            <button
                                type="button"
                                class="button is-dark"
                                disabled={data.value === ""}
                                onClick={() => organizar()}
                            >
                                Organizar
                            </button>
                        </div>
                    </div>
                </div>
                <div class="control">
                    <button type="button" class="button is-dark">
                        Rememorar
                    </button>
                </div>
            </div>

            <div class="notification is-info is-dark mt-6">
                Selecione uma data para <b>Organizar</b> suas memórias ou <b>Rememore</b> todas elas.
            </div>
        </div>
    )
}
