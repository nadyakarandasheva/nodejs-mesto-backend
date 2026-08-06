import { Response, NextFunction } from 'express';

import { AuthRequest } from '../interfaces/auth.interface';
import Card from '../models/card';

/** Получает карточки. */
export const getCards = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(next);

/** Создает карточку. */
export const createCard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req?.user?._id.toString() })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

/** Удаляет карточку по идентификатору. */
export const deleteCardById = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;
  const currentUserId = req?.user?._id;

  if (!currentUserId) {
    return Promise.reject(new Error('Действие недоспуно'));
  }

  return Card.findOne({ id: cardId })
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка с указанным id не найдена.',
        });
      }

      if (card.owner.toString() !== currentUserId.toString()) {
        return res.status(403).send();
      }

      return Card.findByIdAndDelete(cardId)
        .then(() => res.status(200).send({
          message: 'Карточка удалена.',
        }));
    })
    .catch(next);
};

/** Устанавливает лайк карточке по идентификатору. */
export const setLikeCardById = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    { _id: cardId },
    { $addToSet: { likes: req?.user?._id } },
    { new: true },
  )
    .then(() => res.status(200).send())
    .catch(next);
};

/** Удаляет лайк с карточки по идентификатору. */
export const deleteLikeCardById = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    { _id: cardId },
    { $pull: { likes: req.body.user._id } },
    { new: true },
  )
    .then(() => res.status(200).send())
    .catch(next);
};
