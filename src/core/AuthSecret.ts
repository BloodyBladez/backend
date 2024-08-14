import * as crypto from "crypto"

/**
 * Класс для создания ключей **авторизации**.
 * @singleton
 */
export class AuthSecret {
  /**
   * TODO. Не реализовано в полной мере.
   */
  createAccountKey(): string {
    return crypto.randomUUID()
  }
}
