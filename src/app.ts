import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/router';
import handleError from 'controllers/errors';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errors } from 'celebrate';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(requestLogger);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})