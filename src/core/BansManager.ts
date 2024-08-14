import { App, Hookable, Req, Res } from "utility-types"

/**
 * Блокировки пользователей и аккаунтов.
 */
export class BansManager implements Hookable {
  initializeHooks(app: App): void {
    app.addHook("preParsing", (req) => this.isBanned_byIP(req.ip))
    app.addHook("preHandler", this.isBanned_byAccount.bind(this))
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

  /**
   * Отправляет необходимый ответ - о том, что пользователь заблокирован.
   *
   * Код состояния: `423 Locked`
   */
  makeResponse(res: Res, banType: "ip" | "account" | "login"): void {
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
   * Заблокировн ли пользователь **по аккаунту (ТОКЕНУ)**?
   */
  isBanned_byAccount(token: string): boolean {
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
