import { readFileSync } from "fs";
import { join } from "path";
import { BB_Requests } from "api-types"
import { App, RequestHandler, Routable } from "utility-types"

export class ApiVersion implements Routable{
	private packageJson: any;

	initializeRoutes(app: App): void {
		app.route({
			url: "/apiVersion",
			method: "GET",
			
			handler: this.#requestHandler.bind(this),
		});
  }          

	#requestHandler: RequestHandler<BB_Requests["/apiVersion"]> = async (
		req,
		res
	) => {
		const packageJsonPath = join(__dirname, '../../package.json');
		this.packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
		return res.send({
			apiVersion: this.packageJson.apiVersion,
			gameVersion: this.packageJson.gameVersion
		}); 
	}
}