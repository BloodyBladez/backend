import { ArrayStorage } from "@eds-fw/storage"
import * as crypto from "crypto"

/**
 * Класс для создания ключей **авторизации**.
 */
export class AuthSecret {
  static readonly USERKEY_LENGTH = 46

  static findUserkey(userId: string): string | undefined {
    return AuthSecret.#storage.find(([id]) => id == userId)?.[1]
  }
  static findUserId(userkey: string): string | undefined {
    return AuthSecret.#storage.find(([, _userkey]) => _userkey == userkey)?.[0]
  }

  /**
   * Уже встроено в метод создания пользователя.
   *
   * @internal
   */
  static createAccountKey(userId: string): void {
    if (AuthSecret.#storage.find(([id]) => id == userId)) return
    AuthSecret.#storage.push([userId, AuthSecret.generateUserkey()])
    AuthSecret.#storage.save()
  }

  /**
   * TODO. Не реализовано в полной мере.
   */
  static generateUserkey(): string {
    return crypto.randomUUID()
  }

  ///////////////////////////////////////////////////////////////////////////////

  static #storage = ArrayStorage.create<[id: string, userkey: string]>(
    "./data/SECRETS.db.json"
  )

  private constructor() {}
}
