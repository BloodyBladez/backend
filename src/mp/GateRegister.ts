import { BB_Requests } from "api-types"
import { JSONSchema } from "json-schema-to-ts"
import { RequestHandler, Routable, Route } from "utility-types"

/**
 * Регистрация (запрос пароля) аккаунта на публичных серверах.
 */
export class GateRegister implements Routable {
  createFastifyRoute(): Route<BB_Requests["/gate/register"]> {
    return {
      url: "/gate/register",
      method: "POST",

      handler: this.#requestsHandler.bind(this),
      schema: {
        body: {
          type: "object",
          required: ["login", "password"],
          properties: {
            login: {
              type: "string",
              minLength: cfg().loginMinLength,
              maxLength: cfg().loginMaxLength,
            },
            password: {
              type: "string",
              minLength: cfg().passwordMinLength,
              maxLength: cfg().passwordMaxLength,
            },
          },
        } satisfies JSONSchema,
      },
    }
  }

  #requestsHandler: RequestHandler<BB_Requests["/gate/register"]> = async (
    req,
    res
  ) => {}
}
