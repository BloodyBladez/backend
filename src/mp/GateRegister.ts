import { BB_Requests } from "api-types"
import { JSONSchema } from "json-schema-to-ts"
import { App, RequestHandler, Routable } from "utility-types"
import { User } from "../core/User.js"

/**
 * Регистрация (запрос пароля) аккаунта на публичных серверах.
 */
export class GateRegister implements Routable {
  initializeRoutes(app: App): void {
    app.route({
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
    })
  }

  #requestsHandler: RequestHandler<BB_Requests["/gate/register"]> = async (
    req,
    res
  ) => {
    const { login, password } = req.body
    if (this.#isRegistred(login)) {
      Errors.GateRegister.userAlreadyRegistred(login, req.ip)
      return res.status(400).send(Errors.GateRegister.youAlreadyRegistred()) //хакеры идут вон
    }

    const userkey = rt.authSecret.createAccountKey()
    User.create({ login, userkey, password })
    return res.status(200).send({ userkey })
  }

  ///////////////////////////////////////////////////////////////////////////////

  #isRegistred(login: string) {
    const maybeUser = User.storage.find((it) => it.login == login)
    return Boolean(maybeUser)
  }
}
