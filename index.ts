require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import createError from 'http-errors';
import cron from 'node-cron';

const app = express();

import { logger as log } from './src/utils/logging';

import routes from './src/routes/index';

import { ENV } from './src/constants/constants';
import { updateUsers } from './src/utils/utils';

mongoose.connect(ENV.db_url);

// When successfully connected
mongoose.connection.on('connected', () => {
  log.info('Established Mongoose Default Connection');
});

// When connection throws an error
mongoose.connection.on('error', (err) => {
  log.error('Mongoose Default Connection Error : ' + err);
});

cron.schedule('* */8 * * *', updateUsers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  log.info(`Server running on port ${port}`);
});

app.use(helmet());
const allowedOrigins = [
  'cookbook-gg.vercel.app',
  ...(process.env.CORS ? [process.env.CORS] : []),
];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(createError(500, 'Blocked by CORS'));
    }

    for (let i = 0; i < allowedOrigins.length; i++) {
      const allowedOrigin = allowedOrigins[i];
      if (origin.indexOf(allowedOrigin)) {
        return callback(null, true);
      }
    }

    callback(createError(500, 'Blocked by CORS'));
  },
};
app.use(cors(corsOptions));

const morganLogStyle =
  ':method :url :status :response-time ms - :res[content-length]';

app.use(
  morgan(morganLogStyle, {
    stream: {
      write: (str) => {
        log.info(str);
      },
    },
  }),
);

app.use(express.json());
app.use('/', routes);
