import { ApiVersion } from "./core/ApiVersion.js"
import { BansManager } from "./core/BansManager.js"
import { initConfig } from "./core/getConfig.js"
import { Gate } from "./mp/Gate.js"
import { GateAuth } from "./mp/GateAuth.js"
import { GateRegister } from "./mp/GateRegister.js"
initConfig()

export const bansManager = new BansManager()

export const gate = new Gate()
export const gateAuth = new GateAuth()
export const gateRegister = new GateRegister()
export const apiVersion = new ApiVersion()
