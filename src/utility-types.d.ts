import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RequestGenericInterface,
  RouteGenericInterface,
  RouteHandlerMethod,
  RouteOptions,
} from "fastify"
import { IncomingMessage, Server, ServerResponse } from "http"

export type Req<Generic extends RequestGenericInterface = any> =
  FastifyRequest<Generic>
export type Res = FastifyReply
export type App = FastifyInstance

/**
 * Роут. [Для чайников](https://qna.habr.com/q/360532)
 */
export type Route<Generic extends RouteGenericInterface = any> = RouteOptions<
  Server,
  IncomingMessage,
  ServerResponse,
  Generic
>
/**
 * Функция/Метод, который(-ая) занимается обработкой самого запроса и выдачей ответа.
 *
 * Часть роута (`Route#handler`).
 */
export type RequestHandler<Generic extends RouteGenericInterface = any> =
  RouteHandlerMethod<Server, IncomingMessage, ServerResponse, Generic>

export type Constructable = new (...params: unknown[]) => unknown
export type Callable = (...params: unknown[]) => unknown
