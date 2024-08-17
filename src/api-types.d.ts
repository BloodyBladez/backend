import { RouteGenericInterface } from "fastify"

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

  "/lobbies-list/": {
    Reply: {}
  }
  "/lobby/refresh-data": {
    Reply: {}
  }
  "/lobby/create": {
    Body: {
      name: string
      password?: string
      maxPlayers: number
    }
  }
  "/lobby/update": {
    Body: {
      name?: string
      password?: string
      maxPlayers?: 2

      leader?: string
      removePlayers?: string[]
    }
  }
  "/lobby/join": {
    Body: {
      lobbyId: string
      password?: string
    }
  }
  "/lobby/leave": {
    Body: {
      lobbyId: string
    }
    Reply: undefined
  }
}

type TypedReqestsMap = Record<string, RouteGenericInterface>
