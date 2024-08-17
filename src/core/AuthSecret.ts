import { ArrayStorage } from "@eds-fw/storage/*"
import * as crypto from "crypto"

/**
 * Класс для создания ключей **авторизации**.
 */
export class AuthSecret {
  static findUserkey(userId: string): string | undefined {
    return AuthSecret.#storage.find(([id]) => id == userId)[1]
  }

  /**
   * Уже встроено в метод создания пользователя.
   *
   * @internal
   */
  static createAccountKey(userId: string): void {
    AuthSecret.#storage.push([userId, AuthSecret.generateUserkey()])
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
}
