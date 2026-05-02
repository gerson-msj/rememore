import { InputHTMLAttributes } from "preact"
import { useRef } from "preact/hooks"

type InputTextType = InputHTMLAttributes<HTMLInputElement> & { label: string }

export default function InputDate({ label, ...inputHtmlAttributes }: InputTextType) {
    const dtRef = useRef<HTMLInputElement>(null)

    return (
        <div class="field">
            {label !== "" && <label class="label">{label}</label>}
            <div class="control has-icons-right">
                <input
                    type="date"
                    {...inputHtmlAttributes}
                    ref={dtRef}
                />
                <span class="icon is-small is-right is-clickable" onClick={() => dtRef.current?.showPicker()}>
                    <i class="fas fa-calendar"></i>
                </span>
            </div>
        </div>
    )
}
