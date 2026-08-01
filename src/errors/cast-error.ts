import { Error  } from "mongoose";

export class CastError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CastError';
  }
}