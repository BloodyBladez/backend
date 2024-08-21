import { Character } from "./Character.js"

export class Game {
  characters: Character[] = []

  /**
   * Следующий раунд (т.е. ход другого игрока).
   */
  nextRound(): void {
    this.characters.forEach((it) => it.usedSkillsHistory.push([]))
  }

  endGame(): void {}
}
