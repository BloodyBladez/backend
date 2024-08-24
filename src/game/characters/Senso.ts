import { CharacterData, CharacterParameters } from "bloodybladez-api-types"
import { Character, SkillExecutor } from "../Character.js"
import { Game } from "../Game.js"
import { EffFire } from "../CommonEffects.js"

export class CharAres extends Character {
  readonly data: CharacterData = {
    maximum: {
      health: 300,
      stamina: 4,
      physicalArmor: 0.25,
      magicalArmor: 0.1,
      elementalArmor: 0,
      physicalDmgModifier: 1,
      magicalDmgModifier: 1,
      elementalDmgModifier: 1,
    },
    current: undefined as unknown as CharacterParameters,
    characterName: "Сэнсо",
    characterId: "Senso",
    skills: [
      {
        skillName: "Алое пламя",
        skillId: "Scarlet Flame",
      },
      {
        skillName: "Рубящий слева",
        skillId: "Left Slash",
      },
      {
        skillName: "Рубящий справа",
        skillId: "Right Slash",
      },
      {
        skillName: "Рубящий снизу",
        skillId: "Upward Slash",
      },
      {
        skillName: "Рубящий сверху",
        skillId: "Downward Slash",
      },
      {
        skillName: "В яблочко",
        skillId: "Bullseye",
      },
      {
        skillName: "Пламенный портал",
        skillId: "Flaming Portal",
      },
    ],
    passiveSkills: [],
  }

  protected readonly skills: Record<string, SkillExecutor> = {
    "Scarlet Flame": (player, opponent) => {
      //НЕ ГОТОВО !!!!!!!
    },
    "Left Slash": (player, opponent) => {
      opponent.damage("physical", 10)
      if (player.roundUsedSkills.includes("Right Slash")) {
        opponent.damage("physical", 5)
        opponent.applyEffect(EffFire)
      }
      player.decreaseStamina()
    },
    "Right Slash": (player, opponent) => {
      opponent.damage("physical", 10)
      if (player.roundUsedSkills.includes("Left Slash")) {
        opponent.damage("physical", 5)
        opponent.applyEffect(EffFire)
      }
      player.decreaseStamina()
    },
    "Upward Slash": (player, opponent) => {
      opponent.damage("physical", 10)
      if (player.roundUsedSkills.includes("Downward Slash")) {
        opponent.damage("physical", 5)
        opponent.applyEffect(EffFire)
      }
      player.decreaseStamina()
    },
    "Downward Slash": (player, opponent) => {
      opponent.damage("physical", 10)
      if (player.roundUsedSkills.includes("Upward Slash")) {
        opponent.damage("physical", 5)
        opponent.applyEffect(EffFire)
      }
      player.decreaseStamina()
    },
    "Bullseye": (player, opponent) => {
      opponent.damage("physical", 20)
      //НЕ ГОТОВО !!!!!!!
      player.decreaseStamina(2)
    },
    "Flaming Portal": (player, opponent) => {
      if (player.roundUsedSkills.includes("Bullseye")) {
        opponent.damage("physical", 40)
        player.decreaseStamina(2)
      }
      //НЕ ГОТОВО !!!!!!!
    },
  }

  constructor(game: Game) {
    super(game)
    this.data.current = { ...this.data.maximum }
  }
}
