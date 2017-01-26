

const request = require('bluebird').promisifyAll(require('request'));
const Promise = require('bluebird');
const pg = require('pg');
const express = require('express');
const PORT = process.env.PORT || 4000;
const app = express();
const SQL = require('sql-template-strings')
const conString = process.env.DATABASE_URL || 'postgres://postgres:qazWSXpostgres77@localhost:5432/postgres';

app.use(express.static('./public'));

app.get('/', (request, response) => response.sendFile('index.html', {root: './public'}));

app.get('/test', fetch);

function fetch(req, resp) {
  //API for raw data of parking facilities
  request.getAsync('https://data.seattle.gov/api/views/3neb-8edu/rows.json')

  //Navigate from raw data to facilitie array
  .then( response => JSON.parse(response.body).data)

  //Filter facility array to remove bad address data
  .then( facilityArray => facilityArray.filter(obj => obj[10] && obj[10].toLowerCase().includes('seattle') && parseInt(obj[8]) !== 127 && parseInt(obj[8]) !== 508 ))

  //Map array to object form to be used by our model
  .then( filteredFacilities => filteredFacilities.map(
    facility => {
      return {id: parseInt(facility[8]),addressFull:facility[10],facilityName: facility[12],
          hoursMF: facility[13],
          hoursSat: facility[14],
          hoursSun: facility[15],
          facilityType: facility[16],
          rate1Hr: parseInt(facility[17]),
          rate2Hr: parseInt(facility[18]),
          rate3Hr: parseInt(facility[19]),
          rateDay: parseInt(facility[20]),
          opName: facility[22],
          opPhone1: facility[23],
          opPhone2: facility[24],
          paymentType: facility[25]
      }
    }
  ))

  //Add location for each facility with Google Maps Geocode API  call
  .then ( parsedFacilities => {
    let locationArray = [];
    let promises = parsedFacilities.map(facility => {
      return request.getAsync(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryStringify(facility.addressFull)}&key=${googleMapsKey}`)
      .catch( e=> console.log(e))
      .then( googleResponse => {
        let locFacility = {};
        Object.keys(facility).forEach(property => {locFacility[property] = facility[property]});
        locFacility.location = JSON.parse(googleResponse.body).results[0].geometry.location;
        locationArray.push(locFacility);
        console.log(`Facility ${facility.id} loaded`);
      })
      .catch( e=> console.log(e))
    });

    //Wait for all location API calls to complete
    Promise.all(promises)
    //Process the swag
    .then(result => {
      updateFacilityData(JSON.stringify(locationArray));
      resp.send(locationArray);
    });
  })
}

function updateFacilityData(facilityAllArray){
  let client = new pg.Client(conString);

  client.connect(err => {
    if (err) console.error(err);
    client.query(SQL
      `INSERT INTO facility_data (
        data_desc,
        data_json
      )
      VALUES (
        'api pull server 01-25-16',
        ${facilityAllArray}
       );`,
      (err, result) => {
        if (err) console.error(err);
        console.log('INSERT COMPLETE');
        client.end();
      }
    );
  })
}

const googleMapsKey = `AIzaSyBpciE8JuzA5cZGHscnBLaJEc4cFs_ksNY`;

//Makes string query ready
function queryStringify(string) {
  return string.trim().replace(/\s{3}/g, '').replace(/\s/g, '+');
}

app.get('/database', (request, response) => {
  let client = new pg.Client(conString);

  client.connect(err => {
    if (err) console.error(err);
    client.query(SQL`
      SELECT * FROM facility_data
      WHERE data
      `,
      (err, result) => {
        if (err) console.error(err);
        response.send(result.rows[0].data_json);
        client.end();
      }
    );
  })
});



app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
