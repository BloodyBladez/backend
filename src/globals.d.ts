import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  RouteOptions,
  RouteGenericInterface,
  RequestGenericInterface,
} from "fastify"
import { ServerConfig } from "./core/getConfig.ts"
import { IncomingMessage, Server, ServerResponse } from "http"

declare global {
  export type Req = FastifyRequest
  export type Res = FastifyReply
  export type App = FastifyInstance
  export type TypedReqestsMap = Record<string, RequestGenericInterface>
  export type Route<Generic extends RouteGenericInterface = unknown> =
    RouteOptions<Server, IncomingMessage, ServerResponse, Generic>
  export interface Routable {
    route(): Route
  }
  export const Errors: typeof import("./messages.ts").Errors
  export function cfg(): ServerConfig
}
export {}
