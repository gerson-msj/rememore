import { define } from "@/utils.ts"
import MemoriasHome from "@/islands/memorias-home.tsx"

/**
 * ### Home de Memórias
 * - Permite selecionar uma data e organizar memórias por data, abre a organização de memórias em /memorias/organizar.
 * - Permite ver as memórias organizadas em /memorias/visualizar
 */

export default define.page(() => <MemoriasHome />)

/*
export const handler = define.handlers({
    GET() {
        return {} // Response.redirect(new URL("/memorias/cadastrar", ctx.req.url), 302)
    }
})
    */
