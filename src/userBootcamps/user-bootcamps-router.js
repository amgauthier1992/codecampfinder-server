const express = require('express')
const logger = require('../middleware/logger')
const validateJWT = require('../middleware/jwt-auth');
const UserBootcampsService = require('./user-bootcamps-service');
const UsersService = require('../users/users-service')
const userBootcampsRouter = express.Router()
const bodyParser = express.json()

userBootcampsRouter
  .route('/')
  .get(validateJWT, (req, res, next) => { //401 gets sent back. 
    const knexInstance = req.app.get('db')
    const currentUser = req.user.user_name

    UsersService.getUserWithUsername(knexInstance, currentUser)
      .then(user => {
        UserBootcampsService.getUserBootcamps(knexInstance, user.user_name)
          .then(bootcamps => {
            return res.status(200).json(bootcamps)
          })
          .catch(next)
      })
  })

module.exports = userBootcampsRouter