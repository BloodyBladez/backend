import { JSONSchema } from "json-schema-to-ts"

/**
 * Регистрация (запрос пароля) аккаунта на публичных серверах.
 */
export class GateRegister implements Routable {
  route(): Route<GateRegisterRequests["/gate/register"]> {
    return {
      url: "/gate/register",
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

export interface GateRegisterRequests extends TypedReqestsMap {
  "/gate/register": {
    Body: {
      login: string
      password: string
    }
  }
}
