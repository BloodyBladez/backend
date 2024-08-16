//@ts-nocheck
global.Errors = (await import("./messages.js")).Errors
global.Messages = (await import("./messages.js")).Messages
global.cfg = (await import("./core/getConfig.js")).getConfig
global.rt = await import("./runtime.js")
