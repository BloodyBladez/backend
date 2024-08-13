import fastify from "fastify"
import { initConfig } from "./core/getConfig.js"
import { Game } from "./game/Game.js"
import { Gate } from "./mp/routes/Gate.js"
import { GateAuth } from "./mp/routes/GateAuth.js"
import { GateRegister } from "./mp/routes/GateRegister.js"

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

  app.route(new Gate().route())
  app.route(new GateAuth().route())
  app.route(new GateRegister().route())

  app.listen({ port: cfg().port })
}
