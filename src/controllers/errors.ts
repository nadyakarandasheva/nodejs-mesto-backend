import { Response, NextFunction } from "express";
import { Error } from 'mongoose';

import { AuthRequest } from "interfaces/auth.interface";

/**
 * Обработчик ошибок запросов.
 * @param { Error } err - Ошибка.
 * @param { AuthRequest } req - Запрос.
 * @param { Response } res - Ответ.
 * @param { NextFunction } next - Функция передачи управления следующему middleware.
 * @returns {Response | void} HTTP-ответ с описанием ошибки.
 */
export const handleError = (err: Error, req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  console.log('err',err)
   console.log('err',err.name)
   console.log(err.name === 'ValidationError')

  if (err.name === 'CastError') {
    res.status(400).json({ message: err.message });

    return;
  }

  if (err.name === 'ValidationError') {
    res.status(404).json({ message: err.message });

    return
  }

  res.status(500).json({ message: 'Ошибка сервера' });
}