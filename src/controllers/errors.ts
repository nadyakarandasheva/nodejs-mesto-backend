import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';

/**
 * Обработчик ошибок запросов.
 * @param { Error } err - Ошибка.
 * @param { Request } req - Запрос.
 * @param { Response } res - Ответ.
 * @returns {Response | void} HTTP-ответ с описанием ошибки.
 */
const handleError = (
  err: Error,
  req: Request,
  res: Response,
):Response | void => {
  if (err.name === 'ValidationError') {
    res.status(404).json({ message: err.message });

    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({ message: err.message });

    return;
  }

  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];

    res.status(404).json({ message: `Пользователь с таким ${field} уже существует.` });

    return;
  }

  res.status(500).json({ message: 'Ошибка сервера' });
};

export default handleError;
