const express = require('express')
const path = require('path')
const logger = require('../logger')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const bodyParser = express.json()

usersRouter
  .route('/users')
  .post(bodyParser, (req, res, next) => {
    const { first_name, last_name, user_name, password } = req.body
    const newUser = { first_name, last_name, user_name, password }
    const knexInstance = req.app.get('db')

    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    UsersService.insertUser(knexInstance, newUser)
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user_name}`))
          .json(user)
      })
      .catch(next)
  })

usersRouter
  .route('/users/:user_id') //read it from params as user_id. when you do
  .patch(bodyParser, (req, res, next) => {
    const { password } = req.body
    const updatedPassword = { password }
    const knexInstance = req.app.get('db')
    const { user_id } = req.params

    UsersService.updatePassword(knexInstance, user_id, updatedPassword)
      .then(updatedRow => {
        res.status(200).json(updatedRow) //we dont want to return the new pw as json?
      })
      .catch(next)
  })

module.exports = usersRouter;