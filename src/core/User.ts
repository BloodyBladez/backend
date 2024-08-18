import path from "path"
import { AuthSecret } from "./AuthSecret.js"
import { randomBytes } from "crypto"
import { ArrayStorage } from "@eds-fw/storage"

/**
 * Базовый пользователь. Никак не связан с игрой; существует абстрактно.
 */
export class User {
  static readonly USER_ID_LENGTH = 16

  /** Является ссылкой на данные в `User.storage` */
  readonly data: Readonly<User.Data>

  lobbyId: string | undefined

  static getById(userId: string): User | undefined {
    const maybeUser = this.instances.find((it) => it.data.id == userId)
    if (!maybeUser) Errors.User.userNotFound(userId)
    return maybeUser
  }
  static massGetById(userIds: string[]): (User | undefined)[] {
    const maybeUsers = userIds.map(this.getById.bind(this))
    if (maybeUsers.includes(undefined))
      maybeUsers.forEach((it, index) =>
        it === undefined ? Errors.User.userNotFound(userIds[index]) : undefined
      )
    return maybeUsers
  }

  static extractFromHeader(authHeader: string | undefined): User | undefined {
    if (!authHeader) return
    const [userId, userkey] = authHeader.split(" ")
    if (!userId || !userkey) return
    const maybeUser = User.instances.find(
      (it) => it.data.id == userId && AuthSecret.findUserkey(userId) == userkey
    )
    return maybeUser
  }

  ///////////////////////////////////////////////////////////////////////////////

  /**
   * @param creationData Сериализуемые данные пользователя. Записываются в `User.storage`
   */
  static create(creationData: Pick<User.Data, "login" | "password">): User {
    const maybeExistsUser = this.instances.find(
      (it) => it.data.login == creationData.login
    )
    if (maybeExistsUser) {
      Errors.User.userAlreadyExists(creationData.login)
      return maybeExistsUser
    }

    const fullData = {
      ...creationData,
      id: User.generateId(),
    }
    const user = new User(fullData)
    User.instances.push(user)
    return user
  }

  static generateId(): string {
    return randomBytes(this.USER_ID_LENGTH / 2).toString("hex")
  }

  /**
   * Все текущие пользователи (в качестве классов)
   */
  static readonly instances: User[] = []

  /**
   * Сырое хранилище **долгосрочных** данных о пользователе
   */
  static readonly storage: ArrayStorage<User.Data>

  static loadFromStorage(): void {
    ;(this.storage as any) = ArrayStorage.create(
      path.join(".", "data", "users.db.json"),
      true
    )

    //При создании класса 'User', данные записываются в хранилище.
    //Во избежание цикличности мы создаём копию и итерируемся по ней.
    //Естественно, очищаем оригинал
    const storageCopy = [...this.storage]
    this.storage.splice(0, this.storage.length)

    for (const userData of storageCopy) User.instances.push(new User(userData))
  }

  private constructor(data: User.Data) {
    const index = User.storage.push(data) - 1
    User.storage.save()
    this.data = User.storage[index]
    AuthSecret.createAccountKey(data.id)
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
