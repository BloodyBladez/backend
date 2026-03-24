import { initConfig } from "./core/getConfig.js"
import { SessionManager } from "./mp/game/SessionManager.js"
initConfig()

export const gameConnectionManager = new SessionManager()
