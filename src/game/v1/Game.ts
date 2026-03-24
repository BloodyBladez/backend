import { randomBytes, randomInt } from "crypto"
import { Character } from "./Character.js"
import { Lobby } from "../Lobby.js"
import { User } from "../../core/User.js"

export class Game {
  readonly gameId: string
  readonly players: Record<string, Character> //[userId, character]
  /** Ходящий игрок первый в массиве */
  characters: Character[] = []
  /** Ходящий персонаж */
  get walking() {
    return this.characters[0]
  }

  /**
   * Следующий раунд (т.е. ход другого игрока).
   */
  nextRound(): void {
    for (const character of this.characters) {
      character.usedSkillsHistory.push([])
      character.currentEffects.forEach((effect) => effect.use())
    }
    const currentCharacter = this.characters.pop()!
    this.characters.unshift(currentCharacter)
  }

  endGame(): void {}

  static readonly GAME_ID_LENGTH = 16

  static generateId(): string {
    return randomBytes(this.GAME_ID_LENGTH / 2).toString("hex")
  }

  constructor(players: Map<User, Character>) {
    this.gameId = randomBytes(8).toString("base64url")

    const users = Array.from(players.keys())
    const characters = Array.from(players.values())
    this.players = Object.fromEntries(
      users.map((user, i) => [user.data.id, characters[i]])
    )

    const rand = randomInt(0, players.size)
    const currentCharacter = characters.splice(rand, 1)
    characters.unshift(currentCharacter[0])

    this.characters.push(...characters)
  }
}
