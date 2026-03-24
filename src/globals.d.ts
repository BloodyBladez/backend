import { ServerConfig } from "./core/getConfig.ts"

declare global {
  export const Errors: typeof import("./messages.ts").Errors
  export const Messages: typeof import("./messages.ts").Messages
  /**
   * Технические лимиты.
   */
  export const Limits: typeof import("./core/limits.ts")
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
  /**
   * Force-Cast типа к указанному.
   * **UNSAFE!** Не проверяет типы в рантайме.
   * Возвращает всегда `true`
   */
  export function reinterpretAs<T>(value: any): asserts value is T
  /**
   * Force-Cast типа к `NonNullable<T>`.
   * **UNSAFE!** Не проверяет типы в рантайме.
   * Возвращает всегда `true`
   */
  export function reinterpretAs_NotNull<T>(
    value: T
  ): asserts value is NonNullable<T>
}
export {}
