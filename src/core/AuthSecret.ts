import Storage from "@eds-fw/storage"
import { SecretUserData } from "bloodybladez-api-types"
import * as crypto from "crypto"

/**
 * Класс для создания ключей **авторизации**.
 */
export class AuthSecret {
  static readonly USERKEY_LENGTH = 46

  static getById(userId: string): SecretUserData | undefined {
    return AuthSecret.#storage.get(userId)
  }
  static findUserId(userkey: string): string | undefined {
    let userId: string | undefined
    AuthSecret.#storage.forEach((value, key) =>
      value.userkey == userkey ? (userId = key) : undefined
    )
    return userId
  }

  /**
   * Уже встроено в метод создания пользователя.
   *
   * @internal
   */
  static createAccountKey(userId: string, password: string | null): void {
    if (AuthSecret.#storage.filter((value, id) => id == userId)) return
    AuthSecret.#storage.set(userId, {
      userkey: AuthSecret.generateUserkey(),
      password,
    })
    AuthSecret.#storage.save()
  }

  /**
   * TODO. Не реализовано в полной мере.
   */
  static generateUserkey(): string {
    return crypto.randomUUID()
  }

  ///////////////////////////////////////////////////////////////////////////////

  static #storage = Storage.create<SecretUserData>("./data/SECRETS.db.json")

  private constructor() {}
}
