'use strict'

const Promise = require('bluebird')
const fsProm = Promise.promisifyAll(require('fs'))
const pg = require('pg')
const Pool = pg.Pool
const ops = module.exports = {}

const pool = new Pool({
  user: 'postgres',
  password: 'qazWSXpostgres77',
  host: 'localhost',
  database: 'postgres',
  max: 10,
  idleTimeoutMillis: 1000
})

pool.on('error', e => console.error(e))

function SQL(parts, ...values) {
  return {
    text: parts.reduce((prev, curr, i) => `${prev}$${i}${curr}`),
    values
  };
}

INSERT INTO facility_data 
(
  data_desc,
  data_json
)
VALUES
(
  'testobj',
  '{"arraykey":[1,2],"stringkey":"ayo"}'
);


const loadRecordProject = function(record) {
  return new Promise((res, rej) => {
    res(pool.query(SQL`
      INSERT INTO projects (
        data_desc,
        data_json)
       VALUES (
         ${record.projectName},

         ${JSON.stringify(record.codeScore)}
       );`))
    .catch(err => rej(err))
  })
}

ops.createTableProject = function() {
  return new Promise((res, rej) => {
    const sqlCreate =`
        CREATE TABLE IF NOT EXISTS
        facility_data (
          data_id SERIAL PRIMARY KEY,
          data_desc VARCHAR(255),
          data_json JSONB NOT NULL
        );`

    res(
      pool.query(sqlCreate)
      .then(() => console.log('create projects success'))
      .catch(err => rej(err))
    )
  })
}

ops.loadProjects = (file) => {
  console.log('in load');
  return fsProm.readFileAsync(`${__dirname}/../public/data/${file}`)
  .then(data => JSON.parse(data.toString().trim()))
  .then(records => records.map(loadRecordProject))
  .then(proms => Promise.all(proms))
  .then(() => console.log('projects loaded successfully'))
  .catch(err => console.error(err))
}
