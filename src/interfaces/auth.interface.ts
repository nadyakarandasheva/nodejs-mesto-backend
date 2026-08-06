import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  _id: string | JwtPayload;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
