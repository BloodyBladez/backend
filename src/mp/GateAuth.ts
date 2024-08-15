import { BB_Requests } from "api-types"
import { JSONSchema } from "json-schema-to-ts"
import { App, RequestHandler, Routable } from "utility-types"
import { User } from "../core/User.js"

/**
 * Аутефикация (запрос пароля) при подключении к серверу.
 */
export class GateAuth implements Routable {
  initializeRoutes(app: App): void {
    app.route({
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
    })
  }

  #requestHandler: RequestHandler<BB_Requests["/gate/auth"]> = async (
    req,
    res
  ): Promise<void> => {
    const { login, password } = req.body
    let tries = this.#tries.get(login) ?? cfg().maxAuthTries

    if (tries == cfg().maxAuthTries) {
      rt.bansManager.createBan(req.ip, "ip")
      rt.bansManager.createBan(login, "login")
      return res.status(406).send({ availableTries: 0 })
    }

    if (!this.#checkPassword(login, password)) {
      tries--
      this.#tries.set(login, tries)
      return res.status(406).send({ availableTries: tries })
    }

    this.#tries.delete(login)
    const userkey = User.storage.find((it) => it.login == login)?.userkey
    if (!userkey) {
      Errors.GateAuth.userDoesNotExist(login)
      return res.status(500).send(Errors.GateAuth.youDoNotExist())
    }

    User.create({ login, userkey, password })
    return res.status(200).send({ userkey })
  }

  ///////////////////////////////////////////////////////////////////////////////

  /** Кол-во попыток войти в аккаунт */
  #tries = new Map<string, number>() //login => tries

  #checkPassword(login: string, password: string) {
    const user = User.storage.find(
      (it) => it.login == login && it.password == password
    )
    return Boolean(user)
  }
}
