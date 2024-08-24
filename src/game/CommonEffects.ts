import { Effect } from "./Effect.js"

export class EffFire extends Effect {
  readonly data = {
    effectId: "Fire",
    effectName: "Огонь",
  }
  duration = 3
  isInstant = false

  use(): void {
    this.target.damage("elemental", 3)
  }
}
