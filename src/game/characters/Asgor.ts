import { CharacterData, CharacterParameters } from "bloodybladez-api-types"
import { Character, SkillExecutor } from "../Character.js"
import { Game } from "../Game.js"
import { EffFire } from "../CommonEffects.js"

export class CharAres extends Character {
  readonly data: CharacterData = {
    maximum: {
      health: 500,
      stamina: 3,
      physicalArmor: 0.15,
      magicalArmor: 0.01,
      elementalArmor: 0,
      physicalDmgModifier: 1,
      magicalDmgModifier: 1,
      elementalDmgModifier: 1,
    },
    current: undefined as unknown as CharacterParameters,
    characterName: "Асгор",
    characterId: "Asgor",
    skills: [
      {
        skillName: "Регенерация",
        skillId: "Regeneration",
      },
      {
        skillName: "Пламенный топор",
        skillId: "Flaming Axe",
      },
      {
        skillName: "Двойной удар",
        skillId: "Double Strike",
      },
      {
        skillName: "Старая школа",
        skillId: "Old School",
      },
      {
        skillName: "Военная хитрость",
        skillId: "Military Trick",
      },
      {
        skillName: "Контрудар",
        skillId: "Counter Strike",
      },
      {
        skillName: "В клочья",
        skillId: "Shred",
      },
      {
        skillName: "Оглушение",
        skillId: "Stun",
      },
      {
        skillName: "Целебное пламя",
        skillId: "Healing Flame",
      },
    ],
    passiveSkills: [],
  }

  protected readonly skills: Record<string, SkillExecutor> = {
    "Regeneration": (player, opponent) => {},
    "Flaming Axe": (player, opponent) => {
      opponent.damage("physical", 14)
      opponent.applyEffect(EffFire)
      //НЕ ГОТОВО !!!!!!!
      player.decreaseStamina()
    },
    "Double Strike": (player, opponent) => {
      opponent.damage("physical", 16)
      //НЕ ГОТОВО !!!!!!!
      player.decreaseStamina()
    },
    "Old School": (player, opponent) => {
      opponent.damage("physical", 18)
      //НЕ ГОТОВО !!!!!!!
      player.decreaseStamina()
    },
    "Military Trick": (player, opponent) => {
      opponent.damage("physical", 20)
      player.decreaseStamina()
    },
    "Counter Strike": (player, opponent) => {},
    "Shred": (player, opponent) => {
      opponent.damage("physical", 20)
      player.decreaseStamina()
    },
    "Stun": (player, opponent) => {
      opponent.damage("physical", 5)
      //НЕ ГОТОВО !!!!!!!
      player.decreaseStamina()
    },
    "Healing Flame": (player, opponent) => {},
  }

  constructor(game: Game) {
    super(game)
    this.data.current = { ...this.data.maximum }
  }
}
