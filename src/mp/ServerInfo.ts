import { ApiTypes } from "bloodybladez-api-types"
import { readFileSync } from "fs"
import path from "path"
import { App, RequestHandler } from "utility-types"
import { User } from "../core/User.js"
import { Lobby } from "../game/Lobby.js"

export class ServerInfo {
  static initializeRoutes(app: App): void {
    this.#loadVersions()

    app.route({
      url: "/server-info",
      method: "GET",
      handler: this.#requestHandler,
      schema: {},
    })
  }

  static #requestHandler: RequestHandler<ApiTypes["/server-info"]> = async (
    req,
    res
  ) => {
    return res.send({
      apiVersion: this.#apiVersion,
      gameVersion: this.#gameVersion,
      serverName: cfg().serverName,
      serverDescription: cfg().serverDescription,
      totalPlayersCount: User.storage.length,
      currentLobbiesCount: Lobby.instances.length,
      isFriendOnly: cfg().isFriendOnly,
    })
  }

  ///////////////////////////////////////////////////////////////////////////////

  private constructor() {}

  static #loadVersions(): void {
    const packageJsonPath = path.join(".", "package.json")
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
    this.#apiVersion = packageJson["apiVersion"]
    this.#gameVersion = packageJson["gameVersion"]
  }

  static #apiVersion: string
  static #gameVersion: string
}
