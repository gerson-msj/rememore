import Home from "@/islands/home.tsx"
import { define } from "../utils.ts"

/**
 * Apresenta o site.
 * Exibe opções de login ou cadastro
 * Se logado, direciona para home de memórias.
 */
export default define.page(() => <Home />)

export const handler = define.handlers({
    GET(ctx) {
        return Response.redirect(new URL("/memorias", ctx.req.url), 302)
    }
})
