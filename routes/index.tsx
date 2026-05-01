import Home from "@/islands/home.tsx"
import { define } from "../utils.ts"

export default define.page(() => <Home />)

// export const handler = define.handlers({
//     GET(ctx) {
//         return Response.redirect(new URL("/memorias/incluir", ctx.req.url), 302)
//     }
// })
