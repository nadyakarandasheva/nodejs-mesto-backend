import express, { Response, NextFunction} from 'express';
import mongoose, { Error } from 'mongoose';
import routes from './router';
import { AuthRequest } from './interfaces/auth.interface';
import { handleError } from 'controllers/errors';
import { errors } from 'celebrate';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req: AuthRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '6a6cad994631efdcc74421a3'
  };

  next();
});

app.use('/', routes);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})