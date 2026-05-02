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
}
