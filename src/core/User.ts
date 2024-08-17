const { ArrayStorage } = await import("@eds-fw/storage")
import path from "path"
import { AuthSecret } from "./AuthSecret.js"
import { randomBytes } from "crypto"

const USER_ID_LENGTH = 16

/**
 * Базовый пользователь. Никак не связан с игрой; существует абстрактно.
 */
export class User {
  /** Является ссылкой на данные в `User.storage` */
  readonly data: Readonly<User.Data>

  /**
   * @param data Сериализуемые данные пользователя. Записываются в `User.storage`
   */
  static create(data: Pick<User.Data, "login" | "password"> | null): User {
    const userId = User.generateId()
    const user = new User({ ...data, id: userId })
    User.instances.push(user)
    return user
  }

  static extractFromHeader(authHeader: string): User | undefined {
    const [userId, userkey] = authHeader.split(" ")
    if (!userId || !userkey) return
    const maybeUser = User.instances.find(
      (it) => it.data.id == userId && AuthSecret.findUserkey(userId) == userkey
    )
    return maybeUser
  }

  static generateId(): string {
    return randomBytes(USER_ID_LENGTH / 2).toString("hex")
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
    const maybeExistsData = User.storage.find((it) => it.id == data.id)
    if (maybeExistsData) this.data = maybeExistsData
    else {
      const index = User.storage.push(data) - 1
      User.storage.save()
      this.data = User.storage[index]
      AuthSecret.createAccountKey(data.id)
    }
  }
}
export namespace User {
  export interface Data {
    id: string
    /** username */
    login: string
    password: string | null
  }
}
