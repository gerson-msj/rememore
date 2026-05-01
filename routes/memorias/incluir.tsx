import { define } from "@/utils.ts"
import { MemoriaData } from "@/app/domain/memoria.ts"
import MemoriasIncluir from "@/islands/memorias-incluir.tsx"

export default define.page<typeof handler>((props) => <MemoriasIncluir {...props.data} />)

export const handler = define.handlers<MemoriaData>({
    GET() {
        const data = new MemoriaData()
        return { data }
    }
})
