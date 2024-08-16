import fastify from "fastify"
import { Game } from "./game/Game.js"

await import("./globals.js")

console.log(Messages.serverIsPreparing())

const game = new Game()
const app = fastify({
  logger: {
    serializers: {
      req: function (req) {
        return { url: req.url }
      },
    },
    level: "info",
    stream: process.stdout,
  },
})

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

app
  .listen({
    port: cfg().port,
  })
  .catch((err) => {
    throw Errors.unexcepted(err)
  })
  .then((address) => console.log(Messages.serverIsReady(address)))

app.log
