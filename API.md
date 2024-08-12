locale: `ru_RU` (native)

# BB Server API

## Присоединение к серверу

## `POST /connect`

Присоединиться к серверу.

Не важно - регистрация или вход (sign in / sign up)

**HEAD:**

```ts

```

**BODY:**

```ts
{
  username: string
}
```

**RESPONSE:**

```ts
status: 401 //Unauthorized (please enter passoword)
```

```ts
status: 200 //OK (no password required)
```

## `POST /connect/auth`

Аутефикация. В данный момент - только ввод пароля.
