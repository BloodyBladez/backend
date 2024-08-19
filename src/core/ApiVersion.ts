import { ApiTypes } from "bloodybladez-api-types"
import { readFileSync } from "fs"
import path from "path"
import { App, RequestHandler } from "utility-types"

export class ApiVersion {
  static initializeRoutes(app: App): void {
    this.#loadVersions()

    app.route({
      url: "/api-version",
      method: "GET",
      handler: this.#requestHandler,
      schema: {},
    })
  }

  static #requestHandler: RequestHandler<ApiTypes["/api-version"]> = async (
    req,
    res
  ) => {
    return res.send({
      apiVersion: this.#apiVersion,
      gameVersion: this.#gameVersion,
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
