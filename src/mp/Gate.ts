import { BB_Requests } from "api-types"
import { JSONSchema } from "json-schema-to-ts"
import { App, RequestHandler, Routable } from "utility-types"
import { User } from "../core/User.js"

/**
 * Врата.
 * Принимают подключения к серверу и при необходимости запрашивают аутефикацию / регистрацию.
 */
export class Gate implements Routable {
  initializeRoutes(app: App): void {
    app.route({
      url: "/gate/connect",
      method: "POST",

      handler: this.#requestHandler.bind(this),
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

  #requestHandler: RequestHandler<BB_Requests["/gate/connect"]> = async (
    req,
    res
  ): Promise<void> => {
    const { login, userkey } = req.body
    if (rt.bansManager.isBanned_byLogin(login))
      return rt.bansManager.makeResponse(res, "login")
    if (rt.bansManager.isBanned_byAccount(userkey))
      return rt.bansManager.makeResponse(res, "account")

    if (cfg().isFriendOnly) return res.status(200)

    if (!this.#isAuthorized(login, userkey))
      return res.status(401).send({ firstTime: true })
    else if (!this.#userkeysAreMatch(login, userkey))
      return res.status(401).send({ firstTime: false })
    else return res.status(200)
  }

  ///////////////////////////////////////////////////////////////////////////////

  #isAuthorized(login: string, userkey: string | undefined) {
    const maybeUser = User.storage.find(
      (it) => it.login == login || it.userkey == userkey
    )
    return Boolean(maybeUser)
  }
  #userkeysAreMatch(login: string, userkey: string) {
    const maybeUser = User.storage.find(
      (it) => it.login == login && it.userkey == userkey
    )
    return Boolean(maybeUser)
  }
}
