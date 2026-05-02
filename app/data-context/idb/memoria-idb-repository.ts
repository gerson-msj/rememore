import IDBContext, { IDBStoreName } from "@/app/data-context/idb/idb-context.ts"
import { Memoria } from "@/app/domain/memoria.ts"

export default class MemoriaIDBRepository {
    private storeName: IDBStoreName

    private _context?: IDBContext

    private get context(): IDBContext {
        if (this._context === undefined) {
            throw new Error("Contexto IDB não inicializado.")
        }
        return this._context!
    }

    private get db(): IDBDatabase {
        if (this._context === undefined) {
            throw new Error("Contexto IDB não inicializado.")
        }
        return this._context!.db
    }

    constructor() {
        this._context = new IDBContext()
        this.storeName = "memorias"
    }

    private open(): Promise<void> {
        return this.context.openDb()
    }

    public async delete(data?: string): Promise<void> {
        await this.open()
        const { transaction, store } = this.context.getTransactionStore("memorias")

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
            transaction.onabort = () => reject(new Error("Transação abortada."))

            if (data === undefined) {
                store.clear()
            } else {
                const index = store.index("data")
                const request = index.openCursor(IDBKeyRange.only(data))

                request.onsuccess = () => {
                    const cursor = request.result
                    if (cursor) {
                        cursor.delete()
                        cursor.continue()
                    }
                }
            }
        })
    }

    public async getAll(data: string): Promise<Memoria[]> {
        await this.open()
        const transaction = this.context.getTransaction(this.storeName, "readonly")
        const store = transaction.objectStore(this.storeName)

        return new Promise((resolve, reject) => {
            transaction.onerror = () => reject(transaction.error)
            transaction.onabort = () => reject(new Error("Transação abortada."))

            const index = store.index("data")
            const request = index.getAll(IDBKeyRange.only(data))

            request.onsuccess = () => {
                resolve(request.result as Memoria[])
            }
        })
    }

    public async add(data: string, memorias: Memoria[]): Promise<void> {
        await this.open()
        const { transaction, store } = this.context.getTransactionStore(this.storeName)

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)
            transaction.onabort = () => reject(new Error("Transação abortada."))

            const index = store.index("data")
            const request = index.openCursor(IDBKeyRange.only(data))

            request.onsuccess = () => {
                const cursor = request.result
                if (cursor) {
                    cursor.delete()
                    cursor.continue()
                } else {
                    for (const memoria of memorias) {
                        store.add(memoria)
                    }
                }
            }
        })
    }
}
