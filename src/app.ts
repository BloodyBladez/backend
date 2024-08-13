import fastify from "fastify"
import { Game } from "./game/Game.js"

await import("./globals.js")
const runtime = await import("./runtime.js")

export async function initApp() {
  const game = new Game()
  const app = fastify()

  app.register(import("@fastify/rate-limit"), {
    max: 20,
    timeWindow: 1000,
    ban: 3_000,
  })

  runtime.bansManager.initializeHooks(app)

  runtime.gate.initializeRoutes(app)
  runtime.gateAuth.initializeRoutes(app)
  runtime.gateRegister.initializeRoutes(app)

  app.listen({ port: cfg().port, host: "::" })
}
