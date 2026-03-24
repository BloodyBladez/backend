import { Limit } from "../lib/Limited.js"

export const httpPort = new Limit(Number).from(1).to(2 ** 32)
export const loginLen = new Limit(String).from(1).to(64)
export const passwordLen = new Limit(String).from(1).to(128)
export const lobbyNameLen = new Limit(String).from(1).to(64)
export const serverNameLen = new Limit(String).from(1).to(128)
export const serverDescriptionLen = new Limit(String).from(0).to(4096)
