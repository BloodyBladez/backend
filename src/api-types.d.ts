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
  "/apiVersion": {}
}

type TypedReqestsMap = Record<string, RouteGenericInterface>
