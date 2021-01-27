const bcrypt = require('bcryptjs');

const encryptPassword = bcrypt.hash(password, 10, function(err, hash) {
  if (err) {
    logger.error(err)
  }
  password = hash;
  console.log(password)
})

module.exports = encryptPassword;