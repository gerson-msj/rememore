export class DateService {
    public static dataHoraLocal(): Date {
        const now = new Date()
        const brTimezoneOffset = -3 * 60
        return new Date(now.getTime() + (brTimezoneOffset - now.getTimezoneOffset()) * 60000)
    }

    static dataLocal_ISOString(): string {
        return this.dataHoraLocal().toISOString().split("T")[0]
    }

    static dataFormatada(isoString: string): string {
        return isoString.split("-").reverse().join("/")
    }

    static isValidISODate(dateStr: string): boolean {
        // 1. valida formato
        const regex = /^\d{4}-\d{2}-\d{2}$/
        if (!regex.test(dateStr)) return false

        // 2. quebra a data
        const [year, month, day] = dateStr.split("-").map(Number)

        // 3. cria data UTC (evita problemas de timezone)
        const date = new Date(Date.UTC(year, month - 1, day))

        // 4. valida se bate exatamente
        return (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
        )
    }
}
