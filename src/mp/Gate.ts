import { RequestGenericInterface } from "fastify"
import { JSONSchema } from "json-schema-to-ts"
import { User } from "../core/User.js"
import { Game } from "../game/Game.js"

/**
 * Врата.
 * Принимают подключения к серверу и аутефицируют пользователя
 */
export class Gate {
  constructor(game: Game, app: App) {
    app.route(this.Route_connection())
  }

  private Route_connection(): Route<Gate.Routes["/connect"]> {
    return {
      url: "/connect",
      method: "POST",

      handler: async (req, res) => {
        const login = req.body.login
        const token = req.body.token
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
      },

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

  private Route_connectionAuth(): Route<Gate.Routes["/connect/auth"]> {
    return {
      url: "/connect/auth",
      method: "POST",

      handler: async (req, res) => {},

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
              nullable: true,
              minLength: cfg().passwordMinLength,
              maxLength: cfg().passwordMaxLength,
            },
          },
        } satisfies JSONSchema,
      },
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
export namespace Gate {
  export interface Routes extends RequestGenericInterface {
    "/connect": {
      Body: {
        login: string
        token?: string
      }
    }
    "/connect/auth": {
      Body: {
        login: string
        password: string
      }
    }
  }
}
