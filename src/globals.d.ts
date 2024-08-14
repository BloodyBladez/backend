import { ServerConfig } from "./core/getConfig.ts"

declare global {
  export const Errors: typeof import("./messages.ts").Errors
  /**
   * Получить текущий конфиг сервера.
   * Если что, функция оптимизирована и не вызывает I/O нагрузок.
   */
  export function cfg(): ServerConfig
  /**
   * Runtime. Инстанции большинства классов сервера.
   *
   * **Внимание!** Риск цикличной зависимости.
   */
  export const rt: typeof import("./runtime.ts")
}
export {}
