'use strict';

(function(module) {

  const facility = {};

  facility.all = [];

  function Facility(obj) {
    if ( !obj.length ) {
      Object.keys(obj).forEach( property => { this[property] = obj[property] });
      facility.all.push(this);
    } else {

      this.id = parseInt(obj[8]);
      this.addressFull = obj[10];
      this.facilityName = obj[12];
      this.hoursMF = obj[13];
      this.hoursSat = obj[14];
      this.hoursSun = obj[15];
      this.facilityType = obj[16];
      this.rate1Hr = parseInt(obj[17]);
      this.rate2Hr = parseInt(obj[18]);
      this.rate3Hr = parseInt(obj[19]);
      this.rateDay = parseInt(obj[20]);
      this.opName = obj[22];
      this.opPhone1 = obj[23];
      this.opPhone2 = obj[24];
      this.paymentType = obj[25];

      if (obj[10] && obj[10].toLowerCase().includes('seattle') && parseInt(obj[8]) !== 127 && parseInt(obj[8]) !== 508 ) {
        facility.all.push(this);
      }
    }

  }

  const googleMapsKey = 'AIzaSyDQa2PVVXDWXN-EU5SRjbITcl1WhyzrGGw';

  facility.fetch = () => {

    // Check if there is garage data has changed
    // $.ajax( { url: 'https://data.seattle.gov/api/views/3neb-8edu/rows.json', method: 'HEAD' })
    // .then((data, msg, xhr) => {
    //   console.log(xhr.getResponseHeader('Last-Modified'));
    // });
    function fetch (callback) {
      let tempArray = [];
      //URLS for practice and real
      // https://data.seattle.gov/api/views/3neb-8edu/rows.json
      //'scripts/data/sample10.json'
      // /fetch -> server-side call
      $.getJSON('scripts/data/allFacilities.json')
      .then( dataObject => {
        if ( !dataObject.data ) {
          dataObject.forEach(facility => new Facility(facility));
          callback();
        } else {

          dataObject.data.forEach(facility => new Facility(facility));

          Promise.all(
            facility.all.map( facility => {
              return $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryStringify(facility.addressFull)}&key=${googleMapsKey}`)
              .then( locationObject => {
                if(locationObject.results[0].geometry.location) {
                  facility.location = locationObject.results[0].geometry.location;
                  tempArray.push(facility);
                }
              })
            })
          )
          .then(() => {
            facility.all = tempArray;
            console.log(tempArray);
            callback();
          });
        }

      });

    }

    return fetch;

  }

  module.facility = facility;
})(window);
