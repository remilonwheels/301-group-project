

const request = require('bluebird').promisifyAll(require('request'));
const Promise = require('bluebird');
const pg = require('pg');
const express = require('express');
// const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const app = express();
const conString = process.env.DATABASE_URL || 'postgres://postgres:qazWSXpostgres77@localhost:5432/postgres';
// const request = require('request');

app.use(express.static('./public'));

app.get('/', (request, response) => response.sendFile('index.html', {root: './public'}));

app.get('/test', (req, resp) => {
  request.getAsync('http://localhost:4000/scripts/data/sample10.json')
  .then( response => JSON.parse(response.body).data)
  .then( facilityArray => facilityArray.filter(obj => obj[10] && obj[10].toLowerCase().includes('seattle') && parseInt(obj[8]) !== 127 && parseInt(obj[8]) !== 508 ))
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
    Promise.all(promises)
    .then(result => resp.send(locationArray));
  })
});

const googleMapsKey = `AIzaSyCI5Y7sWLEb4ullGAaSJDbHHYv2-wPCyUI`;

function queryStringify(string) {
  return string.trim().replace(/\s{3}/g, '').replace(/\s/g, '+');
}


app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
