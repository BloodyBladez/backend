import { ApiTypes } from "api-types"
import { JSONSchema } from "json-schema-to-ts"
import { App, RequestHandler } from "utility-types"
import { User } from "../core/User.js"
import { AuthSecret } from "../core/AuthSecret.js"

/**
 * Регистрация (запрос пароля) аккаунта на публичных серверах.
 */
export class GateRegister {
  static initializeRoutes(app: App): void {
    app.route({
      url: "/gate/register",
      method: "POST",

      handler: this.#requestsHandler,
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
    })
  }

  static #requestsHandler: RequestHandler<ApiTypes["/gate/register"]> = async (
    req,
    res
  ) => {
    const { login, password } = req.body
    if (this.#isRegistred(login)) {
      Errors.GateRegister.userAlreadyRegistred(login, req.ip)
      return res.status(400).send(Errors.GateRegister.youAlreadyRegistred()) //хакеры идут вон
    }

    const user = User.create({ login, password })
    const userkey = AuthSecret.findUserkey(user.data.id)
    if (!userkey) {
      Errors.GateRegister.userDoesNotExist(login)
      return res.status(500).send(Errors.GateRegister.youDoNotExist())
    }
    return res.status(201).send({ userId: user.data.id, userkey })
  }

  ///////////////////////////////////////////////////////////////////////////////

  static #isRegistred(login: string) {
    const maybeUser = User.storage.find((it) => it.login == login)
    return Boolean(maybeUser)
  }

  private constructor() {}
}
