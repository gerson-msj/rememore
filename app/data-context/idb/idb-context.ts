const idbName = "RememoreDB"

const objectStoreNames = [
    "memorias"
] as const

export type IDBStoreName = typeof objectStoreNames[number]

export default class IDBContext {
    private _db?: IDBDatabase
    private _openPromise?: Promise<void>

    public get db(): IDBDatabase {
        if (this._db === undefined) {
            throw new Error("O banco de dados indexado está fechado.")
        }
        return this._db
    }

    constructor() {
        this._db = undefined
    }

    public openDb(): Promise<void> {
        if (this._db) return Promise.resolve()
        if (this._openPromise) return this._openPromise

        this._openPromise = new Promise<void>((resolve, reject) => {
            const request = globalThis.indexedDB.open(idbName)
            request.onupgradeneeded = this.upgradeneeded
            request.onsuccess = () => {
                this._db = request.result
                resolve()
            }
            request.onerror = () => {
                this._db = undefined
                this._openPromise = undefined
                reject(request.error)
            }
        })
        return this._openPromise
    }

    public closeDb(): void {
        this._db?.close()
    }

    public getTransaction(name: IDBStoreName | IDBStoreName[], mode: IDBTransactionMode = "readwrite"): IDBTransaction {
        return this.db.transaction(name, mode)
    }

    public getTransactionStore(storeName: IDBStoreName): { transaction: IDBTransaction; store: IDBObjectStore } {
        const transaction = this.getTransaction(storeName)
        const store = transaction.objectStore(storeName)
        return { transaction, store }
    }

    private upgradeneeded(this: IDBOpenDBRequest) {
        const db = this.result

        const createIndex = (
            objectStore: IDBObjectStore,
            tableName: string,
            indexName: string,
            keyPath: string | Iterable<string>,
            options?: IDBIndexParameters
        ) => {
            if (objectStore.name === tableName && !objectStore.indexNames.contains(indexName)) {
                objectStore.createIndex(indexName, keyPath, options)
            }
        }

        for (const objectStoreName of objectStoreNames) {
            if (!db.objectStoreNames.contains(objectStoreName)) {
                db.createObjectStore(objectStoreName, { autoIncrement: false, keyPath: ["data", "ordem"] })
            }
            const transaction = this.transaction
            if (transaction === null) continue
            const objectStore = transaction.objectStore(objectStoreName)

            /** Criar os indices das tabelas */
            const memorias: IDBStoreName = "memorias"
            createIndex(objectStore, memorias, "data", "data", { unique: false })
            createIndex(objectStore, memorias, "ordem", "ordem", { unique: false })
        }
    }
}
