import { ErrorData } from "@/app/domain/data/error-data.ts"

export function handleError(error: unknown): ErrorData {
    if (error instanceof ErrorData) {
        return error
    }

    if (error instanceof Error) {
        return { ...error }
    }

    const unexpectedError = new Error("Erro imprevisto", { cause: error })
    console.error(unexpectedError)
    return { ...unexpectedError }
}
