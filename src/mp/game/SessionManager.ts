import { WebSocketServer } from "ws"
import { Lobby } from "../../game/Lobby.js"
import { Character, CharacterStatic } from "../../game/v1/Character.js"
import { Game } from "../../game/v1/Game.js"
import { User } from "../../core/User.js"

export class SessionManager {
  private readonly wsServer = new WebSocketServer({ port: cfg().port })
  private readonly sessions = new Map<string, Game>() //[gameId, game]

  /**
   * ВНИМАНИЕ! В `lobby.data.characterIds` должны быть ЧИСТЫЕ данные!
   * @returns ID вебсокета (для подключения)
   */
  create(lobby: Lobby): string | null {
    if (lobby.data.characterIds.includes(null)) return null
    else reinterpretAs<string[]>(lobby.data.characterIds)

    const characterClasses = lobby.data.characterIds.map(Character.getById)
    if (characterClasses.includes(undefined)) return null
    else reinterpretAs<CharacterStatic[]>(characterClasses)

    const users = lobby.data.memberIds.map(User.getById)
    if (users.includes(undefined)) return null
    else reinterpretAs<User[]>(users)

    const characters = characterClasses.map((it) => new it())
    const players = new Map(users.map((user, i) => [user, characters[i]]))
    const game = new Game(players)
    return game.gameId
  }

  ///////////////////////////////////////////////////////////////////////////////
}
