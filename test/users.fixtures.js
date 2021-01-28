const bcrypt = require('bcryptjs');

// function encryptPassword(password){
//   let saltRounds = 10;
//   let newPassword = ''

//   bcrypt.hash(password, saltRounds, function(err, hash){
//     if (err) {
//       logger.error(err)
//     }
//     else {
//       password = hash;
//       newPassword = password;
//     }
//   })

//   return newPassword;
// }

function getHash(err, hash){
  let encrypted = ''
  if (err) {
    logger.error(err)
  }
  else {
    encrypted = hash;
  }
  return encrypted;
}

module.exports = {
//   encryptPassword,
  getHash
}