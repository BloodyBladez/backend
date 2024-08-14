import { readFileSync } from "fs"
import path from "path"
import { BB_Requests } from "api-types"
import { App, RequestHandler, Routable } from "utility-types"

export class ApiVersion implements Routable {
  initializeRoutes(app: App): void {
    app.route({
      url: "/apiVersion",
      method: "GET",
      handler: this.#requestHandler.bind(this),
    })
  }

  #requestHandler: RequestHandler<BB_Requests["/apiVersion"]> = async (
    req,
    res
  ) => {
    return res.send({
      apiVersion: this.#apiVersion,
      gameVersion: this.#gameVersion,
    })
  }

  ///////////////////////////////////////////////////////////////////////////////

  constructor() {
    this.#loadVersions()
  }

  #loadVersions(): void {
    const packageJsonPath = path.join(".", "package.json")
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"))
    this.#apiVersion = packageJson["apiVersion"]
    this.#gameVersion = packageJson["gameVersion"]
  }

  #apiVersion: string
  #gameVersion: string
}
