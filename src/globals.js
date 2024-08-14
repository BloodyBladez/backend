//@ts-nocheck
global.Errors = (await import("./messages.js")).Errors
global.cfg = (await import("./core/getConfig.js")).getConfig
global.rt = await import("./runtime.js")
