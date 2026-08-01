import { Router } from "express";
import { celebrate, Joi } from 'celebrate';

import { createUser, getUserById, getUsers, updateUser, updateUserAvatar } from "controllers/users";
import { createCard, deleteCardById, deleteLikeCardById, getCards, setLikeCardById } from "controllers/cards";

const router = Router();

// Роуты для пользователей.
router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
    avatar: Joi.string().required(),
  }),
}), createUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

// Роуты для карточек.
router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
}), createCard);

router.delete('/cards/:cardId', deleteCardById);

router.put('/cards/:cardId/likes', setLikeCardById);

router.delete('/cards/:cardId/likes', deleteLikeCardById);

export default router;