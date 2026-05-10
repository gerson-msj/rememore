import { ErrorData } from "@/app/domain/data/error-data.ts"

export interface ICategoria {
    id: number
    categoria: string
}

export class Categoria implements ICategoria {
    id: number = 0
    categoria: string = ""
}

export class MemoriaData {
    categorias?: Categoria[]
    error?: ErrorData
}
