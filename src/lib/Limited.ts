import type { JSONSchema } from "json-schema-to-ts"

export const LimitError = Symbol("LimitError")
type AvailablePrimitives = number | string
type AvailableConstructors = NumberConstructor | StringConstructor
type LimitedConverter<PrimitiveTy extends AvailablePrimitives> = (
  value: PrimitiveTy
) => PrimitiveTy | typeof LimitError

/**
 * Создаёт конструктор числа/строки с заданным лимитом
 *
 * @template T Класс типа данных (`String` или `Number`)
 */
export function ConverterWithLimit<
  ConstructorTy extends AvailableConstructors,
  PrimitiveTy extends AvailablePrimitives = ReturnType<ConstructorTy>
>(
  min: number,
  max: number,
  converter: ConstructorTy
): LimitedConverter<PrimitiveTy> {
  return (value) => {
    const converted = converter(value)
    const validationResult = validateLimit(min, max, converted)
    if (validationResult != 0) return LimitError
    return converted as PrimitiveTy
  }
}

export class Limit<
  ConstructorTy extends AvailableConstructors,
  ValueTy extends AvailablePrimitives = ReturnType<ConstructorTy>
> {
  min!: number
  max!: number

  constructor(private readonly converter: ConstructorTy) {}

  from(min: number) {
    this.min = min
    return this
  }
  to(max: number) {
    this.max = max
    return this
  }

  validateLimit(value: ValueTy): -1 | 0 | 1 {
    return validateLimit(this.min, this.max, value)
  }

  checkLimit(value: ValueTy): boolean {
    return validateLimit(this.min, this.max, value) == 0
  }

  toConverter(): LimitedConverter<ValueTy> {
    return ConverterWithLimit(this.min, this.max, this.converter)
  }

  toSchema(): JSONSchema {
    if (this.converter === String)
      return {
        minLength: this.min,
        maxLength: this.max,
        type: "string",
      }
    if (this.converter === Number)
      return {
        minimum: this.min,
        maximum: this.max,
        type: "number",
      }
    return undefined as never
  }
}

/**
 * @returns `-1` if the minimum is violated, `1` if maximum, `0` if OK
 */
function validateLimit(
  min: number,
  max: number,
  value: AvailablePrimitives
): -1 | 0 | 1 {
  if (typeof value == "number" && (value < min || value > max)) return -1
  if (typeof value == "string" && (value.length < min || value.length > max))
    return 1
  return 0
}
