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
            token: {
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
    const { login, token } = req.body
    if (rt.bansManager.isBanned_byLogin(login))
      return rt.bansManager.makeResponse(res, "login")
    if (rt.bansManager.isBanned_byAccount(token))
      return rt.bansManager.makeResponse(res, "account")

    if (!this.#isAuthorized(login, token)) {
      if (cfg().isFriendOnly) return res.status(200)
      else return res.status(401).send({ firstTime: true })
    } else {
      if (cfg().isFriendOnly) return res.status(200)
      else if (!this.#tokensAreMatch(login, token))
        return res.status(401).send({ firstTime: false })
    }
  }

  ///////////////////////////////////////////////////////////////////////////////

  #isAuthorized(login: string, token: string | undefined) {
    const maybeUser = User.storage.find(
      (it) => it.login == login || it.token == token
    )
    return Boolean(maybeUser)
  }
  #tokensAreMatch(login: string, token: string) {
    const maybeUser = User.storage.find(
      (it) => it.login == login && it.token == token
    )
    return Boolean(maybeUser)
  }
}
