import { Request } from 'express';

// предложении из-за ошибки при req.user gpt предложил временное решение
export interface AuthRequest extends Request {
  user?: {
    _id: string;
  }
}