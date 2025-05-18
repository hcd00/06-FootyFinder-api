require('dotenv').config();
require('express-async-errors');
//security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const express = require('express');
const app = express();
const authUser = require('./middleware/authentication');
//connectDB
const connectDB = require('./db/connect');
//routers
const authRouter = require('./routes/auth');
const gamesRouter = require('./routes/games');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set('trust proxy', 1);
app.use(rateLimit({
  windowMS: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per windowMS
}));
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/games', authUser, gamesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
