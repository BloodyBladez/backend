import { randomBytes } from "crypto"
import { User } from "../core/User.js"
import { LobbyData } from "bloodybladez-api-types"

/**
 * Само лобби. Существует исключительно в рантайме.
 */
export class Lobby {
  readonly data: LobbyData

  delete(): void {
    const lobbyIndex = Lobby.instances.indexOf(this)
    if (lobbyIndex == -1) return Errors.Lobby.alreadyDeleted(this.data.name)
    User.massGetById(this.data.memberIds).forEach((it) =>
      it ? (it.lobbyId = undefined) : undefined
    )
    Lobby.instances.splice(lobbyIndex, 1)
  }

  kickMember(member: User): void {
    const index = this.data.memberIds.indexOf(member.data.id)
    if (index == -1) return
    this.data.memberIds.splice(index, 1)
    if (member) member.lobbyId = undefined
  }

  addMember(member: User): void {
    this.data.memberIds.push(member.data.id)
    if (member) member.lobbyId = this.data.id
  }

  static readonly LOBBY_ID_LENGTH = 16

  static getById(lobbyId: string): Lobby | undefined {
    return Lobby.instances.find((it) => it.data.id == lobbyId)
  }

  static create(
    creationData: Pick<
      LobbyData,
      "name" | "password" | "maxPlayers" | "leaderId"
    >
  ): Lobby {
    const fullData: LobbyData = {
      ...creationData,
      id: Lobby.generateId(),
      memberIds: [creationData.leaderId],
    }
    const lobby = new Lobby(fullData)
    Lobby.instances.push(lobby)
    const leader = User.getById(creationData.leaderId)
    if (leader) leader.lobbyId = lobby.data.id
    return lobby
  }

  ///////////////////////////////////////////////////////////////////////////////

  static generateId(): string {
    return randomBytes(this.LOBBY_ID_LENGTH / 2).toString("hex")
  }

  static readonly instances: Lobby[] = []

  private constructor(data: LobbyData) {
    this.data = data
  }
}
