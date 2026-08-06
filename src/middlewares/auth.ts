import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, TokenPayload } from '../interfaces/auth.interface';

export default (req: AuthRequest, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });

    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  let error;

  try {
    payload = jwt.verify(
      token,
      'super-strong-secret',
    ) as TokenPayload;
  } catch (err) {
    error = err;
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });

    return;
  }

  req.user = payload;

  next(error);
};
