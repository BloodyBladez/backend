locale: `ru_RU` (native)

# Файловая структура проекта

> [!NOTE]\
> "НЕ ОТНОСИТСЯ" не значит "НЕ ИМЕЕТ СВЯЗИ" - разные части сервера связаны между собой, но это не влияет на принцип их сортировки.

# `/src/`

Папка с кодом самого сервера.

## `/src/core/`

- То, что относится к самому серверу игры.
- Не имеет _прямой_ связи с игрой.
- Не имеет _прямой_ связи с Web-ом.

## `/src/game/`

- То, что относится к самой игре.
- _Не совсем_ относится к самому серверу.
- Не относится к с Web-у.

## `/src/lib/`

- Вообще не имеет отношения к BloodyBladez и может быть использовано в других проектах.

## `/src/mp/`

- То, что относится к Web-у.
- Не относится к игре (но имеет связь).
- Не относится к самому серверу (но имеет связь).
