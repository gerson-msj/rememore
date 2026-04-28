import { createDefine } from "fresh"
import { ServiceProvider } from "@/app/services/service-provider.ts"

export interface State {
    sp: ServiceProvider
}

export const define = createDefine<State>()
