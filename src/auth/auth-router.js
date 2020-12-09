const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const bodyParser = express.json()

authRouter
  .post('/login', bodyParser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }
    const knexInstance = req.app.get('db')

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    AuthService.getUserWithUserName(knexInstance,loginUser.user_name)
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect user_name or password',
          })

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect user_name or password',
              })

            const sub = dbUser.user_name
            const payload = { user_name: sub }
            res.send({
              authToken: AuthService.createJwt(sub, payload), //token gets sent to client side
            })
          })
      })
      .catch(next)
  })

authRouter
  .route('/current-user')
  .get(requireAuth, (req,res,next) => {
    const user = req.user
    const knexInstance = req.app.get('db')
    
  })


module.exports = authRouter