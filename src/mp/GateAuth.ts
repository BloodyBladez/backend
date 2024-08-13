import { JSONSchema } from "json-schema-to-ts"
import { User } from "../core/User.js"
import { BB_Requests } from "api-types"
import { Routable, Route, RequestHandler } from "utility-types"

/**
 * Аутефикация (запрос пароля) при подключении к серверу.
 */
export class GateAuth implements Routable {
  createFastifyRoute(): Route<BB_Requests["/gate/auth"]> {
    return {
      url: "/gate/auth",
      method: "POST",

      handler: this.#requestHandler.bind(this),
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

  #requestHandler: RequestHandler<BB_Requests["/gate/auth"]> = async (
    req,
    res
  ) => {}

  ///////////////////////////////////////////////////////////////////////////////

  /** Кол-во попыток войти в аккаунт */
  #tries = 0

  #checkPassword(login: string, password: string) {
    const user = User.storage.find(
      (it) => it.login == login && it.password == password
    )
    return Boolean(user)
  }
}
