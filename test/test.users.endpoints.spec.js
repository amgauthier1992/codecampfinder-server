require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
// const { registerUser, makeUserCourse } = require('./users.fixtures');

describe(`Users Endpoints`, function() {
  let db;

  //user_courses,
  const cleanup = () => db.raw(
    `TRUNCATE
      users
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

    bcrypt.hash(newUser.password, 10, function(err, hash) {
      if (err) {
        logger.error(err)
      }
      newUser.password = hash;
      console.log(password)
    })

    return supertest(app)
      .post('/api/users/register')
      .send(newUser)
      .expect(201)
      .expect(res => {
        expect(res.body.first_name).to.eql(newUser.first_name)
        expect(res.body.last_name).to.eql(newUser.last_name)
        expect(res.body.user_name).to.eql(newUser.user_name)
        expect(res.body.password).to.eql(newUser.password)
      })
      .then(res => 
        supertest(app)
          .expect(res.body)
      )
    })
  })

  describe(`POST /api/users/login`, () => {
    it(`successfully logs in the registered user`), () => {
      const user = {
        user_name: 'JDoe123',
        password: 'Abc1234!'
      }

      return supertest(app)
        .post('/api/users/login')
        
    }
  })

})