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

const loadRecordProject = function(record) {
  return new Promise((res, rej) => {
    res(pool.query(SQL`
      INSERT INTO projects (
        project_name,
        project_section,
        date_begin,
        date_end,
        project_img,
        title_description,
        tags,
        gh_repo_name,
        site_link,
        code_score)
       VALUES (
         ${record.projectName},
         ${record.projectSection},
         ${record.dateBegin},
         ${record.dateEnd},
         ${record.projectIMG},
         ${record.titleDescription},
         ${JSON.stringify(record.tags)},
         ${record.ghRepoName},
         ${record.siteLink},
         ${JSON.stringify(record.codeScore)}
       );`))
    .catch(err => rej(err))
  })
}

ops.createTableProject = function() {
  return new Promise((res, rej) => {
    const sqlCreate =`
        CREATE TABLE IF NOT EXISTS
        parking_tbl (
          appdata_name VARCHAR(255) PRIMARY KEY,
          json_data JSONB NOT NULL
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
