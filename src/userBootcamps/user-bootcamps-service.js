const UserBootcampsService = {
  getUserBootcamps(knex, user_name){
    return knex
      .select('*')
      .from('user_bootcamps')
      .where({ user_name })
      .first()
  },
  getUserBootcampById(knex, bootcamp_id){
    return knex
      .from('user_bootcamps')
      .select('*')
      .where({ bootcamp_id })
      .first()
  },
  addUserBootcamp(knex, bootcamp){
    return knex
      .insert(bootcamp) //bootcamp should only have username and bootcampid when its sent here
      .into('user_bootcamps')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteUserBootcamp(knex, bootcamp_id){
    return knex('user_bootcamps')
      .where({ bootcamp_id })
      .delete()
  },
}

module.exports = UserBootcampsService;