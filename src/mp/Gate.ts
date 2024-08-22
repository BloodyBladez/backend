import { ApiTypes } from "bloodybladez-api-types"
import { JSONSchema } from "json-schema-to-ts"
import { App, RequestHandler } from "utility-types"
import { AuthSecret } from "../core/AuthSecret.js"
import { User } from "../core/User.js"

/**
 * Врата.
 * Принимают подключения к серверу и при необходимости запрашивают аутефикацию / регистрацию.
 */
export class Gate {
  static initializeRoutes(app: App): void {
    app.route({
      url: "/gate/connect",
      method: "POST",

      handler: this.#requestHandler,
      schema: {
        body: {
          type: "object",
          required: ["login"],
          properties: {
            login: {
              type: "string",
              minLength: cfg().loginMinLength,
              maxLength: cfg().loginMaxLength,
            },
            userkey: {
              type: "string",
              minLength: 10,
              maxLength: 1_000,
            },
          },
        } satisfies JSONSchema,
      },
    })
  }

  static #requestHandler: RequestHandler<ApiTypes["/gate/connect"]> = async (
    req,
    res
  ): Promise<void> => {
    const { login, userkey } = req.body

    const maybeUsedId = AuthSecret.findUserId(userkey ?? "")
    const userData = User.storage.find((it) => it.login == login)

    if (maybeUsedId && !userData) {
      //пользователь сменил логин
      const userInstance = User.getById(maybeUsedId)
      if (!userInstance) {
        Errors.Gate.userDoesNotExist(maybeUsedId)
        return res.status(500).send()
      }
      userInstance.data.login = login
      return res.status(200).send()
    }

    if (!userData) return res.status(401).send({ firstTime: true })

    if (cfg().isFriendOnly) return res.status(200).send()

    if (!userkey) return res.status(400).send()
    if (!this.#userkeysAreMatch(login, userkey))
      return res.status(401).send({ firstTime: false })

    return res.status(200).send({ userId: userData.id })
  }

  ///////////////////////////////////////////////////////////////////////////////

  static #userkeysAreMatch(login: string, userkey: string): boolean {
    const maybeUser = User.storage.find((it) => it.login == login)
    if (!maybeUser) return false
    const maybeUserkey = AuthSecret.findUserkey(maybeUser.id)
    return maybeUserkey == userkey
  }

  private constructor() {}
}
