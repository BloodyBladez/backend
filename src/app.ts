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

  app.addHook("preValidation", runtime.bansManager.createFastifyHook())

  app.route(runtime.gate.createFastifyRoute())
  app.route(runtime.gateAuth.createFastifyRoute())
  app.route(runtime.gateRegister.createFastifyRoute())

  app.listen({ port: cfg().port })
}
