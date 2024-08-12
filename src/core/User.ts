import { ArrayStorage } from "@eds-fw/storage"
import path from "path"

/**
 * Базовый пользователь. Никак не связан с игрой; существует абстрактно.
 */
export class User {
  /** username */
  login: string
  token: string
  password: string | null

  static readonly storage = ArrayStorage.create<User.StoredData>(
    path.join(".", "data", "users.db.json")
  )
}
export namespace User {
  export type StoredData = Pick<User, "login" | "password" | "token">
}
