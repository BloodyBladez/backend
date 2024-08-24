import Storage from "@eds-fw/storage"
import { PlayerData } from "bloodybladez-api-types"
import path from "path"

export class Player {
  readonly data: PlayerData

  ///////////////////////////////////////////////////////////////////////////////

  static readonly DEFAULT_DATA: Omit<PlayerData, "user"> = {
    selectedCharacter: "Krova",
  }

  static create(data: PlayerData): Player {
    const maybeExistsPlayer = this.instances.find(
      (it) => it.data.user.id == data.user.id
    )
    if (maybeExistsPlayer) {
      Errors.User.userAlreadyExists(data.user.login)
      return maybeExistsPlayer
    }
    const instance = new Player(data)
    this.instances.push(instance)
    this.storage.save()
    return instance
  }

  static readonly instances: Player[] = []

  static readonly storage: Storage<PlayerData>

  static loadFromStorage(): void {
    ;(this.storage as any) = Storage.create(
      path.join(".", "data", "users.db.json"),
      true
    )

    //При создании класса 'Player', данные записываются в хранилище.
    //Во избежание цикличности мы создаём копию и итерируемся по ней.
    //Естественно, очищаем оригинал
    const storageCopy = new Map(this.storage.entries())
    this.storage.clear()
    for (const playerData of storageCopy.values())
      Player.instances.push(new Player(playerData))
  }

  private constructor(data: PlayerData) {
    this.data = data
    Player.storage.set(data.user.id, data)
  }
}
