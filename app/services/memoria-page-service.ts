export function getStorageDate(): string | undefined {
    const dt = globalThis.localStorage.getItem("date")
    return (dt ?? "") === "" ? undefined : dt!
}

export function setStorageDate(date: string) {
    globalThis.localStorage.setItem("date", date)
}
