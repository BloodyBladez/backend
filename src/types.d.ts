export type AvailableApiVersions = "1";
export type KnownEvents =
  | makeEvent<"createLobby", "1">
  | makeEvent<"joinLobby", "1">
  | makeEvent<"leaveLobby", "1">;

type makeEvent<
  Name extends string,
  Version extends AvailableApiVersions = "1"
> = `${Name}_v${Version}`;
