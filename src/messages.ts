export const detailedErrors = true

export const Errors = {
  getConfig: {
    parseError: (err: unknown) =>
      new Error(
        `ОШИБКА: Не удалось прочитать конфиг сервера.` + detailedErrors
          ? "\n\tПодробно: " + err
          : ""
      ),
  },
}
