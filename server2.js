

const request = require('bluebird').promisifyAll(require('request'));
const Promise = require('bluebird');
const pg = require('pg');
const express = require('express');
const PORT = process.env.PORT || 4000;
const app = express();
const conString = process.env.DATABASE_URL || 'postgres://postgres:qazWSXpostgres77@localhost:5432/postgres';

app.use(express.static('./public'));

app.get('/', (request, response) => response.sendFile('index.html', {root: './public'}));

app.get('/test', fetch);

function fetch(req, resp) {
  //API for raw data of parking facilities
  request.getAsync('http://localhost:4000/scripts/data/sample10.json')

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
    console.log(parsedFacilities);
    let locationArray = [];
    let promises = parsedFacilities.map(facility => {
      return request.getAsync(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryStringify(facility.addressFull)}&key=${googleMapsKey}`)
      .then( response => {
        let locFacility = {};
        Object.keys(facility).forEach(property => {locFacility[property] = facility[property]});
        locFacility.location = JSON.parse(response.body).results[0].geometry.location;
        locationArray.push(locFacility);
      })
    })
    //Wait for all location API calls to complete
    Promise.all(promises)

    //Process the swag
    .then(result => resp.send(locationArray));
  })
}

const googleMapsKey = `AIzaSyCI5Y7sWLEb4ullGAaSJDbHHYv2-wPCyUI`;

//Makes string query ready
function queryStringify(string) {
  return string.trim().replace(/\s{3}/g, '').replace(/\s/g, '+');
}

app.get('/database', (request, response) => {
  let client = new pg.Client(conString);

  client.connect(err => {
    if (err) console.error(err);
    client.query(
      `SELECT * FROM facility_data`,
      (err, result) => {
        if (err) console.error(err);
        response.send(result);
        client.end();
      }
    );
  })
});



app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
