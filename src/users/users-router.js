const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config')
const logger = require('../middleware/logger')
const validateJWT = require('../middleware/jwt-auth');
const UsersService = require('./users-service');
const usersRouter = express.Router()
const bodyParser = express.json()

usersRouter
  .route('/register')
  .post(bodyParser, (req, res, next) => {
    const { first_name, last_name, user_name, password } = req.body
    const newUser = { first_name, last_name, user_name, password }
    const knexInstance = req.app.get('db')
    const saltRounds = 10;

    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    //encrypt pw and overwrite plaintext pw on newUser object
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        logger.error(err)
        return res.status(400).send("Something went wrong");
      }
      else {
        newUser.password = hash;
        UsersService.createUser(knexInstance, newUser)
          .then(newUser => {
            return res.status(201).json(newUser)
          })
          .catch(next)
      }
    });
  })

usersRouter
  .route('/login', bodyParser, (req,res,next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }
    const knexInstance = req.app.get('db')

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    UsersService.getUserWithUsername(knexInstance, loginUser.user_name)
      .then(dbUser => {
        if (!dbUser) {
          return res.status(400).json({ error: 'Incorrect user_name or password' }) 
        }
        else {
          UsersService.comparePasswords(loginUser.password, dbUser.password)
            .then(match => {
              if (!match)
                return res.status(400).json({ error: 'Incorrect user_name or password' })
              else {
                UsersService.postLogin(knexInstance, user_name, dbUser.password)
                  const payload = {
                    user_name : loginUser.user_name,
                    first_name: loginUser.first_name,
                    last_name: loginUser.last_name
                  }
                  jwt.sign(payload, JWT_SECRET, {expiresIn: '30m'}, function(err, token) {
                    if (err) {
                      return res.status( 406 ).send( "Something went wrong" );
                    }
                    else {
                      return res.status( 202 ).json({ token } ) 
                    }
                  })
              }
            })
        }
      })
  })

usersRouter
  .route('/user', validateJWT, (req, res) => {
    console.log(req.user.user_name)
    return res.status(200).send( { message: `Hello ${req.user.first_name}`} );
  })


// usersRouter
//   .route('/users/:user_id') 
//   .patch(bodyParser, (req, res, next) => {
//     const { password } = req.body
//     const updatedPassword = { password }
//     const knexInstance = req.app.get('db')
//     const { user_id } = req.params

//     UsersService.updatePassword(knexInstance, user_id, updatedPassword)
//       .then(updatedRow => {
//         res.status(200).json(updatedRow) 
//       })
//       .catch(next)
//   })

module.exports = usersRouter;
