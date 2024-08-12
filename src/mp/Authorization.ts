export class Authorization {
  private constructor() {}

  check(req: Req): boolean {
    const token = req.headers.authorization
  }
}
