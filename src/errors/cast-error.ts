import { Error } from 'mongoose';

class CastError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CastError';
  }
}
export default CastError;
