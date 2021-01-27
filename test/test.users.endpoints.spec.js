require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const logger = require('../src/middleware/logger.js');
// const { registerUser, makeUserCourse } = require('./users.fixtures');

describe(`Users Endpoints`, function() {
  let db;

  const cleanup = () => db.raw(
    `TRUNCATE 
      users,
      user_courses
    RESTART IDENTITY CASCADE`
  )
  
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db) 
  })
  
  after('disconnect from db', () => db.destroy())
    
  before('cleanup', () => cleanup())
    
  afterEach('cleanup', () => cleanup())

  describe(`POST /api/users/register`, () => {
    it(`creates a new user, responding with 201 and the new user`, () => {

    const newUser = {
      first_name: 'John',
      last_name: 'Doe',
      user_name: 'JDoe123',
      password: 'Abc1234!'
    }

    return supertest(app)
      .post('/api/users/register')
      .send(newUser)
      .expect(201)
      .expect(res => {
        expect(res.body.first_name).to.eql(newUser.first_name) //optional?
        expect(res.body.last_name).to.eql(newUser.last_name) //optional
        expect(res.body.user_name).to.eql(newUser.user_name)

        let hash = res.body.password
        bcrypt.compare(newUser.password, hash)
          .then(result => {
            expect(result).to.be.true;
          });
      })
    })
  })

  describe(`POST /api/users/login`, () => {
    it(`successfully logs in the registered user and creates a JWT for their session`, () => {
    //   db.raw(`INSERT INTO users (user_name, first_name, last_name, password) VALUES ('Jdoe123', 'John', 'Doe', 'Abc1234!')`)
      db('users').insert({ user_name: 'Jdoe123', first_name: 'John', last_name: 'Doe', password: 'Abc1234!' })
        .then(() => {
          logger.info('Inserted data')
          db.select('*').from('users').where('user_name', '=', 'Jdoe123').andWhere('password', '=', 'Abc1234!')
            .then(data => {
              if(data){
                console.log(data)
              } 
              else {
                logger.error('Data not inserted into users table')
              }
            })
        })
        // .then(() => {
        //   return supertest(app)
        //     .post('/api/users/login')
        //     .send({ user_name: 'Jdoe123', password: 'Abc1234!'})
        //     .expect(202)
        // })
    })
  })
})