require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/config')
const app = require('../src/app');
const logger = require('../src/middleware/logger.js');
// const { encryptPassword, getHash } = require('./users.fixtures');

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
        expect(res.body.first_name).to.eql(newUser.first_name)
        expect(res.body.last_name).to.eql(newUser.last_name)
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
      
      const loginUser = {
        first_name: 'Jane',
        last_name: 'Doe',
        user_name: 'JDoe456',
        password: 'Abc1234!'
      }

      //simulate a registration and hash the password
      bcrypt.hash(loginUser.password, 10, function(err, hash){
        if (err) {
          logger.error(err)
          return;
        }
        else {
          //overwrite plaintext password with hash
          loginUser.password = hash

          //insert the new user into the db with the hashed password
          db('users').insert({ user_name: loginUser.user_name, first_name: loginUser.first_name, last_name: loginUser.last_name, password: loginUser.password }).returning('*')
            .then(rows => {
              logger.info('Inserted data')
              let row = rows[0]

              let currentUser = {
                user_name: row.user_name,
                password: row.password
              }

              const payload = {
                user_name : row.user_name,
                first_name: row.first_name,
                last_name: row.last_name
              }

              //create JWT
              jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' }, function(err, token) {
                if (err) {
                  logger.error(err)
                  return;
                }
                else {
                  //assert that the JWT generated above matches token received in res.body
                  return supertest(app)
                    .post('/api/users/login')
                    .send(currentUser)
                    .expect(202)
                    .expect(res => {
                      expect(res.body).to.have.property('token')
                      expect(res.body.token).to.eql(token)
                    })
                }
              })
            })
        }
      })
    })
  })

  describe(`GET /api/users/validate`, () => {
    it(`successfully verifies a user's session token`, () => {

      const loginUser = {
        first_name: 'Jack',
        last_name: 'Doe',
        user_name: 'JDoe789',
        password: 'Abc1234!'
      }

      return supertest(app)
        .post('/api/users/register')
        .send(loginUser)
        .then(res => {
          let currentUser = {
            user_name: res.body.user_name,
            password: 'Abc1234!' //need to send unhashed pw to login endpoint
          }
          return supertest(app)
            .post('/api/users/login')
            .send(currentUser)
            .then(res => {
              let token = res.body.token
              return supertest(app)
                .get(`/api/users/validate`)
                .set('session_token', token)
                .expect(200)
                .expect(res => {
                  expect(res.body.message).to.eql('Successful Authentication')
                })
            })
        })
    })   
  })
})
