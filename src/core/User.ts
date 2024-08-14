import { ArrayStorage } from "@eds-fw/storage"
import path from "path"

/**
 * Базовый пользователь. Никак не связан с игрой; существует абстрактно.
 */
export class User {
  /** Является ссылкой на данные в `User.storage` */
  readonly data: Readonly<User.Data>

  /**
   * @param data Сериализуемые данные пользователя. Записываются в `User.storage`
   */
  static create(data: User.Data | null): void {
    const user = new User(data)
    User.instances.push(user)
  }

  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Все текущие пользователи (в качестве классов)
   */
  static readonly instances: User[] = []

  /**
   * Сырое хранилище **долгосрочных** данных о пользователе
   */
  static readonly storage = ArrayStorage.create<User.Data>(
    path.join(".", "data", "users.db.json")
  )

  static loadFromStorage(): void {
    for (const userData of User.storage) User.create(userData)
  }

  private constructor(data: User.Data | null) {
    const maybeExistsData = User.storage.find(
      (it) => it.login == data.login && it.userkey == data.userkey
    )
    if (maybeExistsData) this.data = maybeExistsData
    else {
      const index = User.storage.push(data) - 1
      this.data = User.storage[index]
    }
  }
}
export namespace User {
  export interface Data {
    /** username */
    login: string
    userkey: string
    password: string | null
  }
}
