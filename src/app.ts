import fastify from "fastify"
import { Game } from "./game/Game.js"

await import("./globals.js")

export async function initApp() {
  const game = new Game()
  const app = fastify()

  app.register(import("@fastify/rate-limit"), {
    max: 20,
    timeWindow: 1000,
    ban: 3_000,
  })

  rt.bansManager.initializeHooks(app)

  rt.gate.initializeRoutes(app)
  rt.gateAuth.initializeRoutes(app)
  rt.gateRegister.initializeRoutes(app)
  rt.apiVersion.initializeRoutes(app)

  app.listen({ port: cfg().port, host: "::" })
}
