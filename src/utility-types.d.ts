import {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
  RequestGenericInterface,
  RouteGenericInterface,
  RouteOptions,
  RouteHandlerMethod,
} from "fastify"
import { Server, IncomingMessage, ServerResponse } from "http"

export type Req = FastifyRequest
export type Res = FastifyReply
export type App = FastifyInstance
export type TypedReqestsMap = Record<string, RequestGenericInterface>
export type Route<Generic extends RouteGenericInterface = unknown> =
  RouteOptions<Server, IncomingMessage, ServerResponse, Generic>
export type RequestHandler<Generic extends RouteGenericInterface = unknown> =
  RouteHandlerMethod<Server, IncomingMessage, ServerResponse, Generic>
export interface Routable {
  createFastifyRoute(): Route
}
