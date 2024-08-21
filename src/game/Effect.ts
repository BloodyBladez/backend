import {
  ArmorName,
  DamageModifierName,
  EffectData,
} from "bloodybladez-api-types"
import { Character } from "./Character.js"
import { Entries } from "utility-types"

export abstract class Effect {
  abstract readonly data: EffectData
  /** Сколько ещё раундов будет действовать эффект? */
  abstract duration: number
  target: Character

  /**
   * **Относительные** временные модификаторы. Сбрасываются по окончанию эффекта.
   *
   * Пример: У цели маг.броня `0.4`. Временный модификатор - `2` => маг.броня = `0.8` (0.4\*2)
   */
  temporaryModifiers: {
    [x in ArmorName]: number
  } & {
    [x in DamageModifierName]: number
  } = {
    physicalArmor: 1,
    magicalArmor: 1,
    physicalDmgModifier: 1,
    magicalDmgModifier: 1,
  }
  /**
   * Если `false` - эффект начинает действовать со следующег хода.
   * Иначе - он действует сразу после наложения.
   */
  abstract isInstant: boolean

  /**
   * Функция которая вызывается каждый раунд.
   * Собственно, сам механизм эффекта.
   */
  abstract use(): void

  start(): void {
    for (const [propName, modifier] of Object.entries(
      this.temporaryModifiers
    ) as Entries<typeof this.temporaryModifiers>)
      this.target.data.current[propName] *= modifier

    if (this.isInstant) this.use()
    this.onStart?.()
  }
  onStart?: () => void = undefined

  finish(): void {
    const index = this.target.currentEffects.indexOf(this)
    if (index == -1) return

    for (const [propName, modifier] of Object.entries(
      this.temporaryModifiers
    ) as Entries<typeof this.temporaryModifiers>)
      this.target.data.current[propName] /= modifier

    this.target.currentEffects.splice(index, 1)
    this.onFinish?.()
  }
  onFinish?: () => void = undefined

  /**
   * **Должно быть вызвано в методе `#use()`**.
   *
   * Проверяет, не закончился ли эффект по времени. При необходимости, удаляет его.
   */
  protected validateDuration(): void {
    this.duration--
    if (this.duration == 0) this.finish()
  }

  protected constructor(target: Character) {
    this.target = target
    this.start()
  }
}
