import { RouteGenericInterface } from "fastify"
import { User } from "../core/User.js"
import { Game } from "../game/Game.js"
import { JSONSchema } from "json-schema-to-ts"

/**
 * Врата.
 * Принимают подключения к серверу и аутефицируют пользователя
 */
export class Gate {
  constructor(game: Game, app: App) {
    this.connectionHandler(app)
  }

  private connectionHandler(app: App): Route<Gate.Routes["/connect"]> {
    return {
      url: "/connect",
      method: "POST",
      handler: async (req, res) => {
        const login = req.body.login
        if (!this.#isAuthorized(login)) {
        }
      },
      schema: {
        body: {
          type: "object",
          required: [],
          properties: {
            login: {
              type: "string",
              minLength: cfg().loginMinLength,
              maxLength: cfg().loginMaxLength,
            },
          },
        } satisfies JSONSchema,
      },
    }
  }

  ///////////////////////////////////////////////////////////////////////////////

  #isAuthorized(login: string) {
    const maybeUser = User.storage.find((it) => it.login == login)
    return Boolean(maybeUser)
  }
  #tokenIsMatches(login: string, token: string) {
    const maybeUser = User.storage.find((it) => it.login == login && it.token)
    return Boolean(maybeUser)
  }
}
export namespace Gate {
  export interface Routes extends Record<string, RouteGenericInterface> {
    "/connect": {
      Body: {
        login: string
      }
    }
  }
}
