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

export type Req<Generic extends RequestGenericInterface = unknown> =
  FastifyRequest<Generic>
export type Res = FastifyReply
export type App = FastifyInstance

/**
 * Роут. [Для чайников](https://qna.habr.com/q/360532)
 */
export type Route<Generic extends RouteGenericInterface = unknown> =
  RouteOptions<Server, IncomingMessage, ServerResponse, Generic>
/**
 * Функция/Метод, который(-ая) занимается обработкой самого запроса и выдачей ответа.
 *
 * Часть роута (`Route#handler`). **Если это метот - используйте `Function#bind`**
 */
export type RequestHandler<Generic extends RouteGenericInterface = unknown> =
  RouteHandlerMethod<Server, IncomingMessage, ServerResponse, Generic>

/**
 * Объект (класс), который может создавать роуты.
 * Метод `initializeRoutes()` необходимо вызывать в главном файле сервера.
 */
export interface Routable {
  initializeRoutes(app: App): void
}
/**
 * Объект (класс), который может создавать хуки.
 * Метод `initializeHooks()` необходимо вызывать в главном файле сервера.
 */
export interface Hookable {
  initializeHooks(app: App): void
}
