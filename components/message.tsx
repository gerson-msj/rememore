import { Signal, useSignal } from "@preact/signals"
import { createDeferred, Deferred } from "@/app/services/page-service.ts"
import { useEffect } from "preact/hooks"

type MessageResult = "ok" | "cancel"

interface IMessageOptions {
    header?: string
    body?: string
    type?: "ok" | "okCancel" | "cancel" | "none"
}

interface IMessageData {
    isActive: boolean
    options: IMessageOptions
}

export class MessageController {
    public data?: Signal<IMessageData>
    private deferred?: Deferred<MessageResult>

    public get isActive(): boolean {
        return this.data!.value.isActive === true
    }

    public open(options: IMessageOptions): Promise<MessageResult> {
        if (this.isActive) {
            return Promise.reject("Já existe uma mensgem aberta.")
        }

        this.data!.value = { ...this.data!.value, options, isActive: true }
        this.deferred = createDeferred<MessageResult>()
        return this.deferred.promise
    }

    public close(result: MessageResult) {
        if (this.isActive) {
            this.data!.value = { ...this.data!.value, isActive: false }
        }

        this.deferred?.resolve(result)
        this.deferred = undefined
    }
}

interface IMessageProps {
    controller: MessageController
}

export function Message(props: IMessageProps) {
    const { controller } = props
    controller.data = useSignal<IMessageData>({ isActive: false, options: {} })
    const { options } = controller.data.value

    const messageHeader = options.header ?? options.body
    const messageBody = options.header === undefined && options.body !== undefined ? undefined : options.body
    const showOk = options.type === "ok" || options.type === "okCancel"
    const showCancel = options.type === "cancel" || options.type === "okCancel"

    useEffect(() => {
        return () => {
            controller.close("cancel")
        }
    }, [])

    return (
        <div class={` modal ${controller.isActive ? "is-active" : ""}`}>
            <div class="modal-background is-clickable" onClick={() => controller.close("cancel")}></div>
            <div class="modal-content">
                <div class="message ">
                    <div class="message-header">
                        <p>{messageHeader}</p>
                    </div>

                    <div class="message-body">
                        <div class="field is-grouped  is-align-items-center">
                            <div class="control is-expanded is-pre-wrap">
                                {messageBody}
                            </div>
                            <div class="control">
                                <div class="buttons is-right">
                                    {showOk && (
                                        <button
                                            type="button"
                                            class="button is-primary is-outlined"
                                            onClick={() => controller.close("ok")}
                                        >
                                            <span class="icon is-small">
                                                <i class="fas fa-check"></i>
                                            </span>
                                        </button>
                                    )}

                                    {showCancel && (
                                        <button
                                            type="button"
                                            class="button is-danger is-outlined"
                                            onClick={() => controller.close("cancel")}
                                        >
                                            <span class="icon is-small">
                                                <i class="fas fa-times"></i>
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
