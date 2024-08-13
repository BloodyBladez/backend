import { preValidationHookHandler } from "fastify"

/**
 * Блокировки пользователей и аккаунтов.
 */
export class BansManager {
  createFastifyHook(): preValidationHookHandler {
    return (req, res) => {}
  }
}
