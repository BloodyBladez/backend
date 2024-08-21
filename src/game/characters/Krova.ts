import { CharacterData, CharacterParameters } from "bloodybladez-api-types"
import { Character, SkillExecutor } from "../Character.js"
import { Game } from "../Game.js"
import { Effect } from "../Effect.js"

/**
 * Крова.
 */
export class CharKrova extends Character {
  readonly data: CharacterData = {
    maximum: {
      health: 400,
      stamina: 3,
      physicalArmor: 0.25,
      magicalArmor: 0.1,
      physicalDmgModifier: 1,
      magicalDmgModifier: 1,
    },
    current: undefined as unknown as CharacterParameters,
    characterName: "Крова",
    characterId: "Krova",
    skills: [
      {
        skillName: "Выпад",
        skillId: "Lunge",
      },
      {
        skillName: "Фехтование",
        skillId: "Fencing",
      },
      {
        skillName: "Круговой удар",
        skillId: "Circular hit",
      },
      {
        skillName: "Пронзание",
        skillId: "Piercing",
      },
      {
        skillName: "Теневой удар",
        skillId: "Shadow hit",
      },
      {
        skillName: "Огненный клинок",
        skillId: "Fire blade",
      },
      {
        skillName: "Благословение луны",
        skillId: "Blessing of the Moon",
      },
      {
        skillName: "Кровавая луна",
        skillId: "Bloodmoon",
      },
    ],
  }

  protected readonly skills: Record<string, SkillExecutor> = {
    "Lunge": (player, opponent) => {
      opponent.damage("physical", 10)
      opponent.applyEffect(EffShadowWarrior)
      opponent.applyEffect(EffShadowWarrior)
      player.decreaseStamina()
    },
    "Fencing": (player, opponent) => {
      opponent.damage("physical", 15)
      if (player.roundUsedSkills.includes("Lunge"))
        opponent.damage("physical", 5)
      player.decreaseStamina()
    },
    "Circular hit": (player, opponent) => {
      opponent.damage("physical", 15)
      player.decreaseStamina()
    },
    "Piercing": (player, opponent) => {},
    "Shadow hit": (player, opponent) => {},
    "Fire blade": (player, opponent) => {},
    "Blessing of the Moon": (player, opponent) => {},
    "Bloodmoon": (player, opponent) => {},
  }

  constructor(game: Game) {
    super(game)
    this.data.current = { ...this.data.maximum }
  }
}

/**
 * Не перепутать `target`! Накладывается на противника.
 */
class EffShadowWarrior extends Effect {
  readonly data = {
    effectId: "Shadow warriors",
    effectName: "Теневые воины-пособники Кровы",
  }
  duration = 3 //хода

  use(): void {
    this.target.damage("physical", 3)
    this.validateDuration()
  }
}
