import { RouteGenericInterface } from "fastify"

export interface BB_Requests extends TypedReqestsMap {
  "/gate/connect": {
    Body: {
      login: string
      userkey?: string
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
  "/api-version": {}
}

type TypedReqestsMap = Record<string, RouteGenericInterface>
