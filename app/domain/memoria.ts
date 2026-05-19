import { ErrorData } from "@/app/domain/data/error-data.ts"
import { Categoria } from "@/app/domain/categoria.ts"

interface IMemoria {
    data: string
    ordem: number
    memoria: string
    categoria?: Categoria
}

export class Memoria implements IMemoria {
    data: string = ""
    ordem: number = 0
    memoria: string = ""
    categoria?: Categoria
}

export class MemoriaData {
    data: string = ""
    memorias?: Memoria[]
    error?: ErrorData
}
