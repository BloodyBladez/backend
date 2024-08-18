locale: `ru_RU` (native)

# User :: Управление данными о пользователях, просмотр информации

Пользовватель создаётся при его первом заходе.

Данные пользователя: (общедоступные)

- Логин (в данный момент, аналог ника)
- ID (16 HEX-символов). Константно.
- Аватар (base64-encoded)

## `GET /user/:id`

Получить данные о пользователи (FETCH them).

**REQ PARAMS:**

```ts
id: string(len 16)
```

**RESPONSE:**

```ts
status: 200 //OK
body: {
  id: string(len 16)
  login: string(len 3-20*)
}
```

```ts
//Пользователь не найден
status: 404 //Not Found
```

\* modifiable for server administrators

**RESPONSE:**
