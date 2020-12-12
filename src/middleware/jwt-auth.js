const jwt = require( 'jsonwebtoken' );
const { JWT_SECRET } = require('../config')
const logger = require('./logger');

function validateJWT(req, res, next) {
  const { session_token } = req.headers;    
  jwt.verify(session_token, JWT_SECRET, function(err, decoded) {
    if(err){
      logger.error(err)
      return res.status(404).send('Token expired');
    }
    else {
      req.user = decoded;
      next();
    }
  });
}
  
module.exports = validateJWT
