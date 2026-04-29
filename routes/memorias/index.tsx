import { define } from "@/utils.ts"
import MemoriasHome from "@/islands/memorias-home.tsx"

export default define.page(() => <MemoriasHome />)

export const handler = define.handlers({
    GET(ctx) {
        return Response.redirect(new URL("/memorias/incluir", ctx.req.url), 302)
    }
})
