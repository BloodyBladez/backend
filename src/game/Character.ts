import {
  CharacterData,
  CharacterSkillData,
  DamageType,
} from "bloodybladez-api-types"
import { Game } from "./Game.js"
import { Effect } from "./Effect.js"

export type SkillExecutor = (player: Character, opponent: Character) => unknown

/**
 * Игровой персонаж (существует исключительно в сражении)
 */
export abstract class Character {
  abstract readonly data: CharacterData
  protected abstract readonly skills: Record<string, SkillExecutor>
  protected game: Game
  /**
   * История каждого хода - массив. (А таких ходов много)
   */
  usedSkillsHistory: CharacterSkillData[][] = []
  /**
   * **ID** использованных в этом раунде скиллов
   */
  get roundUsedSkills(): string[] {
    return (this.usedSkillsHistory.at(-1) ?? []).map((it) => it.skillId)
  }
  /**
   * Текущие эффекты игрока.
   */
  currentEffects: Effect[] = []

  /**
   * TODO.
   *
   * @returns `true` если удалось сделать удар (временно, шанс 100%)
   */
  damage(damageType: DamageType, count: number): boolean {
    const damage = count * this.data.current[`${damageType}Armor`]
    this.data.current.health -= damage
    if (this.data.current.health <= 0) this.game.endGame()
    return true
  }

  decreaseStamina(count: number = 1): void {
    this.data.current.stamina -= count
    if (this.data.current.stamina < 0) return Errors.Character.negativeStamina()
    if (this.data.current.stamina == 0) return this.game.nextRound()
  }

  useSkill(skillId: string): void {
    const skillData = this.data.skills.find((it) => it.skillId == skillId)
    if (!skillData) return Errors.Character.skillNotFound(skillId)
    this.usedSkillsHistory.at(-1)!.push(skillData)
    const opponent = this.game.characters.find((it) => it !== this)!
    this.skills[skillId](this, opponent)
  }

  applyEffect(effect: typeof Effect): Effect {
    //@ts-ignore
    const effectInstance = new effect() as Effect
    this.currentEffects.push(effectInstance)
    return effectInstance
  }

  constructor(game: Game) {
    this.game = game
  }
}
