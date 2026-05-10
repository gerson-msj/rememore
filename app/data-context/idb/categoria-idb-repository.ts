import IDBContext, { IDBStoreName } from "@/app/data-context/idb/idb-context.ts"
import { Categoria, ICategoria } from "@/app/domain/categoria.ts"

export default class CategoriaIDBRepository {
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
        this.storeName = "categorias"
    }

    private open(): Promise<void> {
        return this.context.openDb()
    }

    public async delete(categoria?: string): Promise<void> {
        await this.open()
        const { transaction, store } = this.context.getTransactionStore(this.storeName)

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)

            if (categoria === undefined) {
                store.clear()
            } else {
                const index = store.index("categoria")
                const request = index.openCursor(IDBKeyRange.only(categoria))
                request.onsuccess = () => request.result?.delete()
            }
        })
    }

    public async getAll(): Promise<Categoria[]> {
        await this.open()
        const transaction = this.context.getTransaction(this.storeName, "readonly")
        const store = transaction.objectStore(this.storeName)

        return new Promise((resolve, reject) => {
            transaction.onerror = () => reject(transaction.error)
            const request = store.getAll()
            request.onsuccess = () => {
                resolve(request.result as Categoria[])
            }
        })
    }

    public async add(categoria: Categoria): Promise<void> {
        await this.open()
        const { transaction, store } = this.context.getTransactionStore(this.storeName)

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve()
            transaction.onerror = () => reject(transaction.error)

            store.put(categoria)
        })
    }
}
