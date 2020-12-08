const UsersService = {
  insertUser(knex, newUser){
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  updatePassword(knex, id, newPasswordFields){
    return knex('users')
      .where({ user_name : id })
      .update(newPasswordFields)
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  }
}

module.exports = UsersService;