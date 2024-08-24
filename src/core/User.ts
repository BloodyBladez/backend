import { ArrayStorage } from "@eds-fw/storage"
import { UserData } from "bloodybladez-api-types"
import { randomBytes } from "crypto"
import path from "path"
import { AuthSecret } from "./AuthSecret.js"

/**
 * Базовый пользователь. Никак не связан с игрой; существует абстрактно.
 */
export class User {
  static readonly USER_ID_LENGTH = 16

  /** Является ссылкой на данные в `User.storage` */
  readonly data: UserData

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
      (it) =>
        it.data.id == userId && AuthSecret.getById(userId)?.userkey == userkey
    )
    return maybeUser
  }

  ///////////////////////////////////////////////////////////////////////////////

  /**
   * @param creationData Сериализуемые данные пользователя. Записываются в `User.storage`
   */
  static create(login: string, password: string | null): User {
    const maybeExistsUser = this.instances.find((it) => it.data.login == login)
    if (maybeExistsUser) {
      Errors.User.userAlreadyExists(login)
      return maybeExistsUser
    }

    const fullData = {
      login,
      id: User.generateId(),
    }
    const user = new User(fullData, password)
    User.instances.push(user)
    this.storage.save()
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
  static readonly storage: ArrayStorage<UserData>

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

    for (const userData of storageCopy)
      User.instances.push(new User(userData, undefined))
  }

  private constructor(data: UserData, password: string | null | undefined) {
    const index = User.storage.push(data) - 1
    this.data = User.storage[index]
    if (password !== undefined) AuthSecret.createAccountKey(data.id, password)
  }
}
