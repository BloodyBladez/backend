import { App, Hookable, Req } from "utility-types"

/**
 * Блокировки пользователей и аккаунтов.
 */
export class BansManager implements Hookable {
  initializeHooks(app: App): void {
    app.addHook("preParsing", (req) => this.#isBanned_byIP(req.ip))
    app.addHook("preHandler", this.#isBanned_byAccount.bind(this))
  }

  isBanned(req: Req): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * @returns `true` если удалось заблокировать пользователя
   */
  createIPBan(ip: string): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * @returns `true` если удалось заблокировать пользователя
   */
  createBan(userToken: string): boolean {
    return false //ЗАГЛУШКА
  }

  ///////////////////////////////////////////////////////////////////////////////

  /**
   * Заблокирован ли пользователь **по IP-адресу**?
   */
  #isBanned_byIP(ip: string): boolean {
    return false //ЗАГЛУШКА
  }

  /**
   * Заблокировн ли пользователь **по аккаунту (ТОКЕНУ)**?
   */
  #isBanned_byAccount(token: string): boolean {
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
}
