import { define } from "@/utils.ts"
import { MemoriaData } from "@/app/domain/memoria.ts"
import Cadastrar from "@/islands/memorias/cadastrar.tsx"

export default define.page<typeof handler>((props) => <Cadastrar {...props.data} />)

export const handler = define.handlers<MemoriaData>({
    GET() {
        const data = new MemoriaData()
        return { data }
    }
})
