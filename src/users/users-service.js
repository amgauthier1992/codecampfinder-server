const bcrypt = require('bcryptjs');

const UsersService = {
  createUser(knex, newUser){
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  postLogin(knex, user_name, password){
    return knex
      .select('*')
      .from('users')
      .where({ user_name, password })
      .first()
  },
  getUserWithUsername(knex, user_name){
    return knex
      .select('*')
      .from('users')
      .where({ user_name })
      .first()
  },
  comparePasswords(password, hash){
    return bcrypt.compare(password, hash)
  }
  // updatePassword(knex, id, newPasswordFields){
  //   return knex('users')
  //     .where({ user_name : id })
  //     .update(newPasswordFields)
  //     .returning('*')
  //     .then(rows => {
  //       return rows[0]
  //     })
  // }
}

module.exports = UsersService;