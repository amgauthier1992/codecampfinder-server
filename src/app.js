require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const validateBearerToken = require('./middleware/validate-bearer-token')
const errorHandler = require('./middleware/error-handler')
const usersRouter = require('./users/users-router')

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))

app.use(cors());
app.use(helmet());
app.use(validateBearerToken)

// routers

app.use('/api/users', usersRouter)
// app.use('/api/bootcamps', bootcampsRouter)
// app.use('/api/userBootcamps', userBootcampsRouter)
// app.use('/api/auth', authRouter)

app.use(errorHandler)

module.exports = app;