import { randomInt } from "crypto"
import { Character } from "./Character.js"

export class Game {
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

  constructor(characters: Character[]) {
    const rand = randomInt(0, characters.length)
    const currentCharacter = characters.splice(rand, 1)
    characters.unshift(currentCharacter[0])

    this.characters.push(...characters)
  }
}
