import { ApiTypes } from "api-types"
import { JSONSchema } from "json-schema-to-ts"
import { App, RequestHandler } from "utility-types"
import { User } from "../core/User.js"
import { Lobby } from "../game/Lobby.js"

const MAX_SUPPORTED_LOBBY_MEMBERS = 2
const MIN_SUPPORTED_LOBBY_MEMBERS = 2

export class LobbyManager {
  static initializeRoutes(app: App): void {
    app.route({
      url: "/lobby-list",
      method: "GET",
      handler: this.#getLobbyList,
    })

    app.route({
      url: "/lobby/refresh-data",
      method: "GET",
      handler: this.#refreshLobbyData,
    })

    app.route({
      url: "/lobby/create",
      method: "POST",
      handler: this.#createLobby,

      schema: {
        body: {
          type: "object",
          required: ["name", "password", "maxPlayers"],
          properties: {
            name: {
              type: "string",
              minLength: cfg().lobbyNameMinLength,
              maxLength: cfg().lobbyNameMaxLength,
            },
            password: {
              type: "string",
              nullable: true,
              minLength: cfg().passwordMinLength,
              maxLength: cfg().passwordMaxLength,
            },
            maxPlayers: {
              type: "number",
              minimum: MIN_SUPPORTED_LOBBY_MEMBERS,
              maximum: MAX_SUPPORTED_LOBBY_MEMBERS,
            },
          },
        } satisfies JSONSchema,
      },
    })

    app.route({
      method: "PATCH",
      url: "/lobby/update",
      handler: this.#updateLobby,

      schema: {
        body: {
          type: "object",
          required: [],
          properties: {
            name: {
              type: "string",
              minLength: cfg().lobbyNameMinLength,
              maxLength: cfg().lobbyNameMaxLength,
            },
            password: {
              type: "string",
              nullable: true,
              minLength: cfg().passwordMinLength,
              maxLength: cfg().passwordMaxLength,
            },
            maxPlayers: {
              type: "number",
              minimum: MIN_SUPPORTED_LOBBY_MEMBERS,
              maximum: MAX_SUPPORTED_LOBBY_MEMBERS,
            },
            leader: {
              type: "string",
              minLength: User.USER_ID_LENGTH,
              maxLength: User.USER_ID_LENGTH,
            },
            removeMembers: {
              type: "array",
              items: {
                type: "string",
                minLength: User.USER_ID_LENGTH,
                maxLength: User.USER_ID_LENGTH,
              },
              minItems: 0,
              maxItems: MAX_SUPPORTED_LOBBY_MEMBERS - 1,
            },
          },
        } satisfies JSONSchema,
      },
    })

    app.route({
      url: "/lobby/join",
      method: "POST",
      handler: this.#joinLobby,

      schema: {
        querystring: {
          id: {
            type: "string",
            minLength: Lobby.LOBBY_ID_LENGTH,
            maxLength: Lobby.LOBBY_ID_LENGTH,
          },
        } satisfies Record<"id", JSONSchema>,
        body: {
          type: "object",
          required: [],
          properties: {
            password: {
              type: "string",
              minLength: cfg().passwordMinLength,
              maxLength: cfg().passwordMaxLength,
            },
          },
        } satisfies JSONSchema,
      },
    })

    app.route({
      url: "/lobby/leave",
      method: "POST",
      handler: this.#leaveLobby,
    })

    app.route({
      url: "/lobby/launch-game",
      method: "POST",
      handler: this.#launchGame,
    })
  }

  static #getLobbyList: RequestHandler<ApiTypes["/lobby-list/"]> = async (
    req,
    res
  ): Promise<void> => {
    return res
      .status(200)
      .send({ lobbyList: Lobby.instances.map((it) => it.data) })
  }

  static #refreshLobbyData: RequestHandler<ApiTypes["/lobby/refresh-data"]> =
    async (req, res): Promise<void> => {
      const user = User.extractFromHeader(req.headers.authorization)
      if (!user) return res.status(401).send()

      const { lobbyId } = user
      if (!lobbyId) return res.status(400).send()
      const lobby = Lobby.getById(lobbyId)
      if (!lobby) return res.status(410).send()

      return res.status(200).send(lobby.data)
    }

  static #createLobby: RequestHandler<ApiTypes["/lobby/create"]> = async (
    req,
    res
  ): Promise<void> => {
    const { name, password, maxPlayers } = req.body
    const user = User.extractFromHeader(req.headers.authorization)
    if (!user) return res.status(401).send()
    if (user.lobbyId) return res.status(400).send()

    const lobby = Lobby.create({
      name,
      password,
      maxPlayers,
      leaderId: user.data.id,
    })
    return res.status(201).send({ lobbyId: lobby.data.id })
  }

  static #updateLobby: RequestHandler<ApiTypes["/lobby/update"]> = async (
    req,
    res
  ): Promise<void> => {
    const newData = req.body
    const user = User.extractFromHeader(req.headers.authorization)
    if (!user) return res.status(401).send()

    const { lobbyId } = user
    if (!lobbyId) return res.status(400).send()
    const lobby = Lobby.getById(lobbyId)
    if (!lobby) return res.status(404).send()
    if (lobby.data.leaderId != user.data.id) return res.status(403).send()

    if (newData.removeMembers) {
      lobby.data.memberIds = lobby.data.memberIds.filter(
        (it) => !newData.removeMembers?.includes(it)
      )
    }

    Object.assign(lobby.data, newData) //модифицируем объект, расположенный по ссылке 'lobby.data'
    return res.status(200).send(lobby.data)
  }

  static #joinLobby: RequestHandler<ApiTypes["/lobby/join"]> = async (
    req,
    res
  ): Promise<void> => {
    const user = User.extractFromHeader(req.headers.authorization)
    if (!user) return res.status(401).send()
    if (user.lobbyId) return res.status(400).send()

    const { id: lobbyId } = req.query
    const { password } = req.body
    const lobby = Lobby.getById(lobbyId)
    if (!lobby) return res.status(404).send()

    if (lobby.data.memberIds.length == lobby.data.maxPlayers)
      return res.status(406).send()
    if (lobby.data.password && password != lobby.data.password)
      return res.status(409).send()

    lobby.addMember(user)
    res.status(202).send(lobby.data)
  }

  static #leaveLobby: RequestHandler<ApiTypes["/lobby/leave"]> = async (
    req,
    res
  ): Promise<void> => {
    const user = User.extractFromHeader(req.headers.authorization)
    if (!user) return res.status(401).send()

    const { lobbyId } = user
    if (!lobbyId) return res.status(400).send()
    const lobby = Lobby.getById(lobbyId)
    if (!lobby) return res.status(404).send()

    if (lobby.data.leaderId == user.data.id) lobby.delete()
    else lobby.kickMember(user)
    res.status(200).send()
  }

  static #launchGame: RequestHandler<ApiTypes["/lobby/launch-game"]> = async (
    req,
    res
  ): Promise<void> => {
    const user = User.extractFromHeader(req.headers.authorization)
    if (!user) return res.status(401).send()

    const { lobbyId } = user
    if (!lobbyId) return res.status(400).send()
    const lobby = Lobby.getById(lobbyId)
    if (!lobby) return res.status(404).send()
    if (lobby.data.leaderId != user.data.id) return res.status(403).send()

    //TODO
    res.status(501).send()
  }
}
