const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const AuthService = {
  getUserWithUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, JWT_SECRET, {
      subject,
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256',
    })
  },
  verifyJwt(token) { //using this method on all endpoints
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })
  }
};

module.exports = AuthService