import { accessSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import * as ini from "ini"
import path from "path"

let configInstance: ServerConfig

export interface ServerConfig {
  /**
   * Порт сервера.
   */
  port: number
  /**
   * Является ли сервер дружеским?
   *
   * Влияет на аутефикацию, регистрацию и возможность запустить бой без лидера лобби
   */
  isFriendOnly: boolean
  /** Технический лимит. @internal */
  loginMinLength: number
  /** Технический лимит. @internal */
  loginMaxLength: number
  /** Технический лимит. @internal */
  passwordMinLength: number
  /** Технический лимит. @internal */
  passwordMaxLength: number
  /**
   * Максимальное кол-во попыток пройти аутефикацию.
   */
  maxAuthTries: number
}

export function initConfig(): void {
  const content = readConfig()
  if (content === null) configInstance = getDefaultConfig()
  else
    try {
      configInstance = { ...getDefaultConfig(), ...ini.parse(content) }
    } catch (err) {
      throw Errors.getConfig.parseError(err)
    }
}

export function getConfig(): ServerConfig {
  return configInstance
}

///////////////////////////////////////////////////////////////////////////////////////////
// Boilerplate

function getDefaultConfig(): ServerConfig {
  return {
    port: 6969, //xd
    isFriendOnly: true,
    loginMinLength: 3,
    loginMaxLength: 20,
    passwordMinLength: 3,
    passwordMaxLength: 20,
    maxAuthTries: 3,
  }
}
function readConfig(): string | null {
  const relativeFilePath = path.join(".", "bb-config.ini")
  const filePath = path.resolve(relativeFilePath)

  try {
    accessSync(filePath)
    return readFileSync(filePath, "utf8")
  } catch (err) {
    createConfig(filePath, ini.stringify(getDefaultConfig()))
    return null
  }
}
function createConfig(filePath: string, content: string): void {
  const parentPath = path.dirname(filePath)
  mkdirSync(parentPath, { recursive: true })
  writeFileSync(filePath, content)
}
