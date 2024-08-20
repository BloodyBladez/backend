import { fastifyCors } from "@fastify/cors"
import { fastifyRateLimit } from "@fastify/rate-limit"
import fastify from "fastify"
import { BansManager } from "./core/BansManager.js"
import { User } from "./core/User.js"
import { Gate } from "./mp/Gate.js"
import { GateAuth } from "./mp/GateAuth.js"
import { GateRegister } from "./mp/GateRegister.js"
import { LobbyManager } from "./mp/LobbyManager.js"
import { ServerInfo } from "./mp/ServerInfo.js"
import { UserManager } from "./mp/UserManager.js"

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

await app.register(fastifyCors, {
  origin: "*",
})

User.loadFromStorage()

BansManager.initializeHooks(app)
ServerInfo.initializeRoutes(app)

Gate.initializeRoutes(app)
GateAuth.initializeRoutes(app)
GateRegister.initializeRoutes(app)

LobbyManager.initializeRoutes(app)
UserManager.initializeRoutes(app)

app
  .listen({
    port: cfg().port,
    host: "::",
  })
  .catch((err) => {
    throw Errors.unexcepted(err)
  })
  .then((address) => console.log(Messages.serverIsReady(address)))
