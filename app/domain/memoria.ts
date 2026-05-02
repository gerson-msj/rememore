import { ErrorData } from "@/app/domain/data/error-data.ts"

interface IMemoria {
    data: string
    ordem: number
    memoria: string
}

export class Memoria implements IMemoria {
    data: string = ""
    ordem: number = 0
    memoria: string = ""
}

export class MemoriaData {
    data?: string
    memorias?: Memoria[]
    error?: ErrorData
}
