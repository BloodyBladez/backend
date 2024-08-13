import { ServerConfig } from "./core/getConfig.ts"

declare global {
  export const Errors: typeof import("./messages.ts").Errors
  export function cfg(): ServerConfig
}
export {}
