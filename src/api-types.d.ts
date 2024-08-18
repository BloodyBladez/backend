import { RouteGenericInterface } from "fastify"
import { Lobby } from "./game/Lobby.ts"
import { User } from "./core/User.ts"

export interface ApiTypes extends TypedReqestsMap {
  "/api-version": {
    Reply: {
      apiVersion: string
      gameVersion: string
    }
  }

  ///////////////////////////////////////////////////////////////////////////////

  "/gate/connect": {
    Body: {
      login: string
      userkey?: string
    }
    Reply:
      | {
          //userkey / login не совпадают
          firstTime: boolean
        }
      | {
          //успех
          userId: string
        }
  }
  "/gate/auth": {
    Body: {
      login: string
      password: string
    }
    Reply:
      | {
          //неправильный пароль
          availableTries: number
        }
      | {
          //успех
          userkey: string
          userId: string
        }
      | string //error
  }
  "/gate/register": {
    Body: {
      login: string
      password: string
    }
    Reply:
      | {
          //успех
          userkey: string
          userId: string
        }
      | string //error
  }

  ///////////////////////////////////////////////////////////////////////////////

  "/lobby-list/": {
    Reply: {
      lobbyList: Lobby.Data[]
    }
  }
  "/lobby/refresh-data": {
    Reply?: Lobby.Data
  }
  "/lobby/create": {
    Body: {
      name: string
      password: string | null
      maxPlayers: number
    }
    Reply?: {
      lobbyId: string
    }
  }
  "/lobby/update": {
    Body: Partial<Omit<Lobby.Data, "id">> & {
      /** `userId[]` */
      removeMembers?: string[]
    }
    Reply?: Lobby.Data
  }
  "/lobby/join": {
    Querystring: {
      id: string
    }
    Body: {
      password?: string
    }
    Reply?: Lobby.Data
  }
  "/lobby/leave": {
    Reply: undefined
  }
  "/lobby/launch-game": {
    Reply?: {
      gameId: string
    }
  }

  ///////////////////////////////////////////////////////////////////////////////

  "/user/:id": {
    Params: {
      id: string
    }
    Reply?: Pick<User.Data, "id" | "login">
  }
}

type TypedReqestsMap = Record<string, RouteGenericInterface>
