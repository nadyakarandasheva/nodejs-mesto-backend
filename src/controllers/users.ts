import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { AuthRequest } from 'interfaces/auth.interface';
import { CastError } from 'errors/cast-error';

/**
 * Получает список пользователей.
 */
export const getUsers =  (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
}

/**
 * Получает пользователя по идентификатору.
 */
export const getUserById =  (req: Request, res: Response, next: NextFunction): Promise<void | Response>  => {
  return User.find({_id: req.params.userId})
    .then((user) => {
      if (!user) {
        throw new CastError('Нет пользователя с таким id');
      }

      res.status(200).send({ data: user })
    })
    .catch(next);
}

/**
 * Создает пользователя.
 */
export const createUser = (req: Request, res: Response, next: NextFunction): Promise<void | Response>  => {
  const { name, about, avatar } = req.body;
  console.log(req.body);

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch(next);
};

/**
 * Обновляет данные пользователя.
 */
export const updateUser = (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response>  => {
  const { name, about } = req.body;

  return User.findOneAndUpdate( { _id: req.body.user._id },
    { $set: {  name, about } },
    { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

/**
 * Обновляет аватар пользователя
 */
export const updateUserAvatar = (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response>  => {
  const { avatar } = req.body;

  return User.findOneAndUpdate( { _id: req.body.user._id },
    { $set: {  avatar } },
    { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};