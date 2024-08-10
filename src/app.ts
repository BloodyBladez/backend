import { IncomingMessage, createServer } from "http";
import { WebSocketServer, MessageEvent } from "ws";
import { KnownEvents } from "./types.js";

type EventHandler = (msg: MessageEvent) => unknown;

const eventsMap: Partial<Record<KnownEvents, EventHandler>> = {};

export function registerEvent(event: KnownEvents, handler: EventHandler) {
  if (eventsMap[event]) console.warn(`Overriding event '${event}' listener`);
  eventsMap[event] = handler;
}

export function initApp(port: number) {
  const rawNodeServer = createServer();
  const wsServer = new WebSocketServer({ server: rawNodeServer });
  wsServer.on("connection", async (ws, req) => {
    ws.onmessage = handleWSMessage.bind({});
    ws.on("error", (error) => ws.send(error.stack));
  });
}

async function handleWSMessage(
  ws: WebSocket,
  req: IncomingMessage,
  event: MessageEvent
) {
  switch (event.type as KnownEvents) {
    case "createLobby_v1":
      return;
    case "joinLobby_v1":
      return;
    case "leaveLobby_v1":
      return;
    default:
      ws.send(
        `Error: Unknown event: '${event.type}'. Maybe the server is out of date?`
      );
      return;
  }
}
