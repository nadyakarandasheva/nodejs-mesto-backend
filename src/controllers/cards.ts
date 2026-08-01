import { Response, NextFunction } from 'express';

import Card from '../models/card';
import { AuthRequest } from 'interfaces/auth.interface';

/**
 * Получает карточки.
 */
export const getCards =  (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response> => {
  // Если нет идентификатора пользователя - возвращаем ошибку.
  if(!req?.user?._id) {
    res.status(401).send({
      message: 'Необходима авторизация',
    });

    return Promise.resolve();
  }

  return Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
}

/**
 * Создает карточку.
 */
export const createCard = (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response>  => {
  const { name, link } = req.body;

  // Если нет идентификатора пользователя - возвращаем ошибку.
  if(!req?.user?._id) {
    res.status(401).send({
      message: 'Необходима авторизация',
    });

    return Promise.resolve();
  }

  return Card.create({ name, link, owner: req.user._id})
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

/**
 * Удаляет карточку по идентификатору.
 */
export const deleteCardById =  (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response>  => {
  // Если нет идентификатора пользователя - возвращаем ошибку.
  if(!req?.user?._id) {
    res.status(401).send({
      message: 'Необходима авторизация',
    });

    return Promise.resolve();
  }

  return Card.deleteOne({_id: req.params.cardId})
    .then(() => res.status(200).send({ message: 'Карточка удалена.'  }))
    .catch(next);
}

/**
 * Устанавливает лайк карточке по идентификатору.
 */
export const setLikeCardById =  (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response>  => {
  const { cardId } = req.params;

  // Если нет идентификатора пользователя - возвращаем ошибку.
  if(!req?.user?._id) {
    res.status(401).send({
      message: 'Необходима авторизация',
    });

    return Promise.resolve();
  }

  return Card.findByIdAndUpdate({ _id: cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true } )
    .then(() => res.status(200).send())
    .catch(next);
}

/**
 * Удаляет лайк с карточки по идентификатору.
 */
export const deleteLikeCardById =  (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response>  => {
  const { cardId } = req.params;

  // Если нет идентификатора пользователя - возвращаем ошибку.
  if(!req?.user?._id) {
    res.status(401).send({
      message: 'Необходима авторизация',
    });

    return Promise.resolve();
  }

  return Card.findByIdAndUpdate({ _id: cardId },
    { $pull: { likes: req.body.user._id } },
    { new: true } )
    .then(() => res.status(200).send())
    .catch(next);
}