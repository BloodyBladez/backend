export const detailedErrors = true

/**
 * Ошибки стоит выкидывать только в том случае, если невозможна корректная работа сервера.
 *
 * Иначе - просто выдаём `error` в консоль.
 */
export const Errors = {
  unexcepted: (err: unknown) => `НЕИЗВЕСТНАЯ ОШИБКА:\n${err}`,
  incorrectServerWork: `Сервер работает некорректно, что может быть причиной большого количества багов.\n\tПожалуйста, обновите его до последней версии (см. https://github.com/BloodyBladez/backend/releases )`,

  AuthSecret: {
    userkeyNotFound: (login: string) =>
      `Ключ (userkey) пользователя '${login}' не найден.\n\tВозможно, произошла рассинхронизация двух хранилищ вследствие ручного вмешательства (не трожьте всё в папке 'data/') ИЛИ багов в коде`,
  },

  User: {
    userAlreadyExists: (login: string) =>
      console.error(
        `БАГ: Пользователь с логином '${login}' уже существует на сервере.\n\t${Errors.incorrectServerWork}`
      ),
    userNotFound: (userId: string) =>
      console.error(
        `БАГ: Пользователя с ID '${userId}' не существует.\n\t${Errors.incorrectServerWork}`
      ),
  },

  GateRegister: {
    userAlreadyRegistred: (login: string, ip: string) =>
      console.debug(
        `Пользователь '${login}' попытался зарегистрироваться, однако его аккаунт уже существует.` +
          `\n\tВозможно, это проделки злоумышленника. Его IP-адрес: '${ip}'`
      ),
    youAlreadyRegistred: () =>
      `При натуральных обстоятельствах, попасть на страницу регистрации уже существующего аккаунта невозможно. Походу, кто-то остался без эксплоита ( ͡° ͜ʖ ͡°)`,
    userDoesNotExist: (login: string) =>
      console.warn(
        `ПРЕДУПРЕЖДЕНИЕ: Странности при регистрации пользователя '${login}'` +
          `\n\tНе удалось создать аккаунт.`
      ),
    /** Версия метода `userDoesNotExist` для клиента */
    youDoNotExist: () => `ОШИБКА: Не удалось создать ваш аккаунт на сервере`,
  },

  GateAuth: {
    userDoesNotExist: (login: string) =>
      console.warn(
        `ПРЕДУПРЕЖДЕНИЕ: Странности при аутефикации пользователя '${login}'` +
          `\n\tПока пользователь входил в свой аккаунт, он был удалён.`
      ),
    /** Версия метода `userDoesNotExist` для клиента */
    youDoNotExist: () =>
      `ОШИБКА: Ваш аккаунт на сервере не найден.\n\tВозможно, он был удалён, пока вы пытались пройти аутефикацию.`,
  },

  Lobby: {
    alreadyDeleted: (name: string) =>
      console.error(
        `БАГ: Лобби '${name}' уже удалено ИЛИ не найдено (при попытке удалить его).\n\t${Errors.incorrectServerWork}`
      ),
  },

  getConfig: {
    parseError: (err: unknown) =>
      new Error(
        `ФАТАЛЬНАЯ ОШИБКА: Не удалось прочитать конфиг сервера.` +
        detailedErrors
          ? "\n\tПодробно: " + err
          : ""
      ),
    limitError: (key: string) =>
      new TypeError(
        `ФАТАЛЬНАЯ ОШИБКА: Значение ключа '${key}' в конфиге не укладывается в технические лимиты.\n\tПросто удалите данную строку, чтобы сервер сам выставил ей значение по умолчанию.`
      ),
  },
}

/**
 * Сообщения (не ошибки и предупреждения), для администраторов сервера
 */
export const Messages = {
  serverIsPreparing: () => `Сервер запускается...`,
  serverIsReady: (host: string) =>
    `Сервер успешно запущен!\n\tЗайти: ${host}/gate/connect \n\tАдмин-панель: <отсутствует>`,
}
