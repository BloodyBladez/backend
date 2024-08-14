import { App, Hookable, Res } from "utility-types"

export type BanType = "ip" | "account" | "login"

/**
 * Блокировки пользователей и аккаунтов.
 * @singleton
 */
export class BansManager implements Hookable {
  /**
   * Блокирует пользователя по его ключу.
   *
   * @returns `true` если удалось заблокировать пользователя
   */
  banAccount(userkey: string): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * @returns `true` если удалось заблокировать пользователя
   */
  createBan(subject: string, banType: BanType): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * Отправляет необходимый ответ - о том, что пользователь заблокирован.
   *
   * Код состояния: `423 Locked`
   */
  makeResponse(res: Res, banType: BanType): void {
    res.status(423).send({ banType })
  }

  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Заблокирован ли пользователь **по IP-адресу**?
   */
  isBanned_byIP(ip: string): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * Заблокировн ли пользователь **по аккаунту (КЛЮЧУ)**?
   */
  isBanned_byAccount(userkey: string): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * (особая)Блокировка по логину **(РЕДКОСТЬ)**.
   * В данный момент используется только при логине
   *
   * Прошу обратить внимание: **не хукается**; вызывается вручную
   */
  isBanned_byLogin(login: string): boolean {
    return false //ЗАГЛУШКА
  }

  #instance: BansManager
  constructor() {
    this.#instance ??= new BansManager()
    return this.#instance
  }

  initializeHooks(app: App): void {
    app.addHook("preParsing", (req) => this.isBanned_byIP(req.ip))
    app.addHook("preHandler", this.isBanned_byAccount.bind(this))
  }
}
