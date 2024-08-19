locale: `ru_RU` (native)

# ServerInfo :: Информация о самом сервере

## `GET /server-info`

Объяснения не требуются ¯\\\_(ツ)\_/¯

**RESPONSE:**

```ts
{
  apiVersion: string
  gameVersion: string
  serverName: string(len 1-256)
  serverDescription: string(len 0-4096)
  /** online & offline */
  totalPlayersCount: number
  currentLobbiesCount: number
  isFriendOnly: boolean
}
```
