import { ApiTypes } from "api-types"
import { JSONSchema } from "json-schema-to-ts"
import { App, RequestHandler } from "utility-types"
import { User } from "../core/User.js"

/**
 * Управляет пользователями (логика запросов / ответов)
 */
export class UserManager {
  static initializeRoutes(app: App): void {
    app.route({
      url: "/user/:id",
      method: "GET",
      handler: this.#getUser,

      schema: {
        params: {
          id: {
            type: "string",
            minLength: User.USER_ID_LENGTH,
            maxLength: User.USER_ID_LENGTH,
          } satisfies JSONSchema,
        },
      },
    })
  }

  static #getUser: RequestHandler<ApiTypes["/user/:id"]> = async (
    req,
    res
  ): Promise<void> => {
    const { id } = req.params
    const maybeUser = User.getById(id)
    if (!maybeUser) return res.status(404).send()
    const publicUserData: NonNullable<ApiTypes["/user/:id"]["Reply"]> = {
      id,
      login: maybeUser.data.login,
    }
    return res.status(200).send(publicUserData)
  }
}
