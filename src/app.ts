import fastify from "fastify"
import { initConfig } from "./core/getConfig.js"
import { Game } from "./game/Game.js"

await import("./globals.js")
initConfig()

export async function initApp() {
  const game = new Game()
  const app = fastify()

  app.register(import("@fastify/rate-limit"), {
    max: 20,
    timeWindow: 1000,
    ban: 3_000,
  })

  app.listen({ port: cfg().port })
}
