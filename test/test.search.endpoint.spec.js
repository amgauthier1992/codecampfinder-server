require('dotenv').config()
const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app')
const { makeBootcampsArray } = require('./bootcamps.fixtures')

// describe(`Search Endpoint`, function() {
//   let db;

//   const cleanup = () => db.raw(
//     `TRUNCATE
//       course_languages,
//       languages,
//       payment_summaries,
//       course_schedules,
//       user_courses,
//       bootcamp_courses,
//       courses,
//       bootcamp_locations,
//       locations, 
//       bootcamps
//     RESTART IDENTITY CASCADE`
//   )

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DATABASE_URL,
//     })
//     app.set('db', db) 
//   })

//   after('disconnect from db', () => db.destroy())
  
//   before('cleanup', () => cleanup())
  
//   afterEach('cleanup', () => cleanup())

//   describe(`POST /api/search`, () => {
//     // context(`Given no folders`, () => {
//     //   it(`responds with 200 and an empty array`, () => {
//     //     return supertest(app)
//     //       .get('/folders')
//     //       .set('Authorization', 'Bearer ' + process.env.API_TOKEN)
//     //       .expect(200, [])
//     //   })
//   })

// })

// -- drop courses 
// DROP TABLE course_languages;
// DROP TABLE languages;
// DROP TABLE payment_summaries;
// DROP TABLE course_schedules;
// DROP TABLE user_courses;
// DROP TABLE bootcamp_courses;
// DROP TABLE courses;

// -- drop bootcamps
// DROP TABLE bootcamp_locations;
// DROP TABLE locations;
// DROP TABLE bootcamps;

// -- drop tables with no relation
// DROP TABLE users;
// DROP TABLE schemaversion;