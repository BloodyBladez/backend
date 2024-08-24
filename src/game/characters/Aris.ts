import { CharacterData, CharacterParameters } from "bloodybladez-api-types"
import { Character, SkillExecutor } from "../Character.js"
import { Game } from "../Game.js"
import { Effect } from "../Effect.js"

export class CharAres extends Character {
  readonly data: CharacterData = {
    maximum: {
      health: 380,
      stamina: 3,
      physicalArmor: 0.2,
      magicalArmor: 0.05,
      elementalArmor: 0,
      physicalDmgModifier: 1,
      magicalDmgModifier: 1,
      elementalDmgModifier: 1,
    },
    current: undefined as unknown as CharacterParameters,
    characterName: "Арис",
    characterId: "Aris",
    skills: [
      {
        skillName: "Воодушевление",
        skillId: "Inspiration",
      },
      {
        skillName: "Выпад",
        skillId: "Thrust",
      },
      {
        skillName: "Сильный удар",
        skillId: "Strong strike",
      },
      {
        skillName: "Наскок",
        skillId: "Charge",
      },
      {
        skillName: "Пронзание",
        skillId: "Pierce",
      },
      {
        skillName: "Световой удар",
        skillId: "Light strike",
      },
      {
        skillName: "Световой шар",
        skillId: "Light orb",
      },
      {
        skillName: "Световой луч",
        skillId: "Light beam",
      },
      {
        skillName: "Вспышка",
        skillId: "Flash",
      },
    ],
  }

  protected readonly skills: Record<string, SkillExecutor> = {
    "Inspiration": (player, opponent) => {},
    "Thrust": (player, opponent) => {
      opponent.damage("physical", 10)
      player.decreaseStamina()
    },
    "Strong strike": (player, opponent) => {
      opponent.damage("physical", 10)
      player.decreaseStamina()
    },
    "Charge": (player, opponent) => {
      opponent.damage("physical", 10)
      // НЕ ГОТОВО !!!!!!!
      player.decreaseStamina()
    },
    "Pierce": (player, opponent) => {
      opponent.damage("physical", 15)
      player.decreaseStamina()
    },
    "Light strike": (player, opponent) => {
      opponent.damage("physical", 10)
      // НЕ ГОТОВО !!!!!!!
      player.decreaseStamina()
    },
    "Light orb": (player, opponent) => {
      opponent.damage("magical", 30)
      // НЕ ГОТОВО !!!!!!!
      player.decreaseStamina()
    },
    "Light beam": (player, opponent) => {
      opponent.damage("magical", 40)
      player.decreaseStamina()
    },
    "Flash": (player, opponent) => {
      opponent.damage("magical", 50)
      //НЕ ГОТОВО !!!!!!!
      player.decreaseStamina(2)
    },
  }

  constructor(game: Game) {
    super(game)
    this.data.current = { ...this.data.maximum }
  }
}
