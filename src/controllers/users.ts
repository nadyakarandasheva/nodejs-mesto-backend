import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/auth.interface';
import CastError from '../errors/cast-error';
import User from '../models/user';

/** Логин пользователя. */
export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return Promise.reject(new Error('Почта и пароль обязательны для заполнения'));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      res
        .cookie('jwt', token, { httpOnly: true })
        .send({ token });
    })
    .catch(next);
};

/** Получает список пользователей. */
export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(next);

/** Получает тукещего пользователя. */
export const getCurrentUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => User.findById(req?.user?._id)
  .then((user) => {
    if (!user) {
      throw new CastError('Нет пользователя с таким id');
    }

    res.status(200).send({ data: user });
  })
  .catch(next);

/** Получает пользователя по идентификатору. */
export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new CastError('Нет пользователя с таким id');
    }

    res.status(200).send({ data: user });
  })
  .catch(next);

/** Создает пользователя. */
export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    const err = new Error('Почта и пароль обязательны для заполнения');
    err.name = 'CastError';

    return Promise.reject(err);
  }

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(201).send(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        },
      );
    })
    .catch(next);
};

/** Обновляет данные пользователя. */
export const updateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, about } = req.body;

  return User.findOneAndUpdate(
    { _id: req.body.user._id },
    { $set: { name, about } },
    { new: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

/** Обновляет аватар пользователя. */
export const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { avatar } = req.body;

  return User.findOneAndUpdate(
    { _id: req.body.user._id },
    { $set: { avatar } },
    { new: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};
