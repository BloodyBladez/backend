import { JSONSchema } from "json-schema-to-ts"

/**
 * Аутефикация (запрос пароля) при подключении к серверу.
 */
export class GateAuth implements Routable {
  route(): Route<GateAuthRequests["/gate/auth"]> {
    return {
      url: "/gate/auth",
      method: "POST",

      handler: async (req, res) => {
        const { login, password } = req.body
      },

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
    }
  }
}

export interface GateAuthRequests extends TypedReqestsMap {
  "/gate/auth": {
    Body: {
      login: string
      password: string
    }
  }
}
