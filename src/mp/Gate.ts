import { JSONSchema } from "json-schema-to-ts"
import { User } from "../core/User.js"
import { BB_Requests } from "api-types"
import { Routable, Route, RequestHandler } from "utility-types"

/**
 * Врата.
 * Принимают подключения к серверу и аутефицируют пользователя
 */
export class Gate implements Routable {
  createFastifyRoute(): Route<BB_Requests["/gate/connect"]> {
    return {
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
              nullable: true,
            },
          },
        } satisfies JSONSchema,
      },
    }
  }

  #requestHandler: RequestHandler<BB_Requests["/gate/connect"]> = async (
    req,
    res
  ) => {
    const { login, token } = req.body
    if (!this.#isAuthorized(login, token)) {
      if (cfg().isFriendOnly) return res.status(200)
      return res
        .status(401)
        .header("Content-Type", "application/json; charset=utf-8")
        .send({ firstTime: true })
    } else {
      if (cfg().isFriendOnly) return res.status(200)
      if (!this.#tokensAreMatch(login, token))
        return res
          .status(401)
          .header("Content-Type", "application/json; charset=utf-8")
          .send({ firstTime: false })
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
