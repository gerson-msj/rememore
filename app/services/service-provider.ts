export type ServiceMap = {
    /** Dados */

    /** Repositories */

    /** Services */
}

type Factory<K extends keyof ServiceMap> = (sp: ServiceProvider) => ServiceMap[K]

export class ServiceProvider {
    #instances = new Map<keyof ServiceMap, ServiceMap[keyof ServiceMap]>()
    #factories = new Map<keyof ServiceMap, Factory<keyof ServiceMap>>()

    registerInstance<K extends keyof ServiceMap>(key: K, instance: ServiceMap[K]) {
        this.#instances.set(key, instance)
    }

    register<K extends keyof ServiceMap>(key: K, factory: Factory<K>) {
        this.#factories.set(key, factory as Factory<keyof ServiceMap>)
    }

    get<K extends keyof ServiceMap>(key: K): ServiceMap[K] {
        if (this.#instances.has(key)) {
            return this.#instances.get(key) as ServiceMap[K]
        }

        const factory = this.#factories.get(key) as Factory<K> | undefined
        if (!factory) {
            throw new Error(`ServiceProvider: Serviço '${String(key)}' não registrado.`)
        }

        const instance = factory(this)
        this.#instances.set(key, instance)
        return instance
    }
}
