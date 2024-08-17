import { fastifyRateLimit } from "@fastify/rate-limit"
import fastify from "fastify"

await import("./globals.js")

console.log(Messages.serverIsPreparing())

const app = fastify({
  logger: {
    level: "info",
    stream: process.stdout,
  },
})

await app.register(fastifyRateLimit, {
  max: 10,
  timeWindow: "1s",
  ban: 3_000,
  hook: "preParsing",
})

rt.bansManager.initializeHooks(app)

rt.gate.initializeRoutes(app)
rt.gateAuth.initializeRoutes(app)
rt.gateRegister.initializeRoutes(app)
rt.apiVersion.initializeRoutes(app)

app
  .listen({
    port: cfg().port,
    host: "::",
  })
  .catch((err) => {
    throw Errors.unexcepted(err)
  })
  .then((address) => console.log(Messages.serverIsReady(address)))
