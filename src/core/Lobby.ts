import { Player as corePlayer } from "./Player.js";

/**
 *
 */
export class Lobby {
  id: UUID;
  players: Lobby.Player[];
}
export namespace Lobby {
  export class Player extends corePlayer {
    isLobbyOwner?: boolean;
  }
}
