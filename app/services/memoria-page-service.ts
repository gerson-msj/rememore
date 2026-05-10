import { DateService } from "@/app/services/date-service.ts"

export type MemoryTab = "cadastrar" | "categorizar" | "revisar"

export function getStorageDate(): string | undefined {
    try {
        const value = globalThis.localStorage.getItem("memoryDate")
        if (value === null) {
            return undefined
        }

        const dt = atob(value)
        return DateService.isValidISODate(dt) ? dt : undefined
    } catch (error) {
        console.error("getStorageDate", error)
        return undefined
    }
}

export function setStorageDate(date: string) {
    const value = btoa(date)
    globalThis.localStorage.setItem("memoryDate", value)
}

export function getStorageTab(): MemoryTab | undefined {
    try {
        const value = globalThis.localStorage.getItem("memoryTab")
        if (value === null) {
            return undefined
        }

        const tab = atob(value)
        return tab === "cadastrar" || tab === "categorizar" || tab === "revisar" ? (tab as MemoryTab) : undefined
    } catch (error) {
        console.error("getStorageTab", error)
        return undefined
    }
}

export function setStorageTab(tab: MemoryTab) {
    const value = btoa(tab)
    globalThis.localStorage.setItem("memoryTab", value)
}
