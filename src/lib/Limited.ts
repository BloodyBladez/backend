export const LimitError = Symbol("LimitError")

/**
 * Constructor of a number or string with limited length (string) or value (number)
 *
 * @template T Data type converter (e.g. `String`, `Number`, ...)
 */
export function Limited<T extends StringConstructor | NumberConstructor>(
  min: number,
  converter: T,
  max: number
): (value: string) => ReturnType<T> | typeof LimitError {
  return (value: string) => {
    const converted = converter(value)
    if (typeof converted == "number" && (converted < min || converted > max))
      return LimitError
    if (
      typeof converted == "string" &&
      (converted.length < min || converted.length > max)
    )
      return LimitError
    return converted as ReturnType<T>
  }
}
