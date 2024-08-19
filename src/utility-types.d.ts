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

export type Constructable<
  ReturnType = unknown,
  ParamsType extends any[] = any[]
> = new (...params: ParamsType) => ReturnType
export type Callable<ReturnType = unknown, ParamsType extends any[] = any[]> = (
  ...params: ParamsType
) => ReturnType

export type Entries<T extends {}> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]
