import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import {
  createUser, login, getCurrentUser, getUserById, getUsers, updateUser, updateUserAvatar,
} from '../controllers/users';
import {
  createCard, deleteCardById, deleteLikeCardById, getCards, setLikeCardById,
} from '../controllers/cards';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

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
