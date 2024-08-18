import { App, Res } from "utility-types"

export type BanType = "ip" | "account"

/**
 * Блокировки пользователей и аккаунтов.
 * @singleton
 */
export class BansManager {
  /**
   * Блокирует пользователя по его ключу.
   *
   * @returns `true` если удалось заблокировать пользователя
   */
  static banAccount(userkey: string): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * @returns `true` если удалось заблокировать пользователя
   */
  static createBan(subject: string, banType: BanType): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * Отправляет необходимый ответ - о том, что пользователь заблокирован.
   *
   * Код состояния: `423 Locked`
   */
  static makeResponse(res: Res, banType: BanType): void {
    res.status(423).send({ banType })
  }

  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Заблокирован ли пользователь **по IP-адресу**?
   */
  static isBanned_byIP(ip: string): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * Заблокировн ли пользователь **по аккаунту (КЛЮЧУ)**?
   */
  static isBanned_byAccount(userId: string): boolean {
    return false //ЗАГЛУШКА
  }

  static initializeHooks(app: App): void {
    /*
    app.addHook("preParsing", (req) => this.isBanned_byIP(req.ip))
    app.addHook("preHandler", this.isBanned_byAccount.bind(this))
*/
  }

  private constructor() {}
}
