import { RequestGenericInterface } from "fastify"

export interface BB_Requests extends TypedReqestsMap {
  "/gate/connect": {
    Body: {
      login: string
      token?: string
    }
  }
  "/gate/auth": {
    Body: {
      login: string
      password: string
    }
  }
  "/gate/register": {
    Body: {
      login: string
      password: string
    }
  }
}

type TypedReqestsMap = Record<string, RequestGenericInterface>
