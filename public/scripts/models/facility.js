'use strict';

(function(module) {

  const facility = {};

  facility.all = [];

  function Facility(obj) {
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

    facility.all.push(this);
  }

  const googleMapsKey = 'AIzaSyCI5Y7sWLEb4ullGAaSJDbHHYv2-wPCyUI';

  facility.fetch = (callback) => {
    // Check if there is garage data has changed
    // $.ajax( { url: 'https://data.seattle.gov/api/views/3neb-8edu/rows.json', method: 'HEAD' })
    // .then((data, msg, xhr) => {
    //   console.log(xhr.getResponseHeader('Last-Modified'));
    // });
    let tempArray = [];


    //URLS for practice and real
    // https://data.seattle.gov/api/views/3neb-8edu/rows.json
    //'scripts/data/sample10.json'
    $.getJSON('scripts/data/sample10.json')
    .then( dataObject => {
      dataObject.data.forEach(facility => new Facility(facility));
      console.log(facility.all);

      Promise.all(
        facility.all.map( facility => {
          return $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryStringify(facility.addressFull)}&key=${googleMapsKey}`)
          .then( locationObject => {
            facility.location = locationObject.results[0].geometry.location;
            tempArray.push(facility);
            console.log(tempArray);
          })
        })
      )
      .then(() => {
        facility.all = tempArray;
        console.log(tempArray);
        // let staticObjectArray = tempArray.map(facility => {
        //   return {
        //     id : facility.id,
        //     addressFull : facility.addressFull,
        //     facilityName : facility.facilityName,
        //     hoursMF : facility.hoursMF,
        //     hoursSat : facility.hoursSat,
        //     hoursSun : facility.hoursSun,
        //     facilityType : facility.facilityType,
        //     rate1Hr : facility.rate1Hr,
        //     rate2Hr : facility.rate2Hr,
        //     rate3Hr : facility.rate3Hr,
        //     rateDay : facility.rateDay,
        //     opName : facility.opName,
        //     opPhone1 : facility.opPhone1,
        //     opPhone2 : facility.opPhone2,
        //     paymentType : facility.paymentType,
        //     location : facility.location
        //   }
        // });
        //
        // console.log(staticObjectArray);
        // localStorage.allFacilitiesAndLocationsArray = JSON.stringify(staticObjectArray);
        callback();
      });
    });
  }

  module.facility = facility;
})(window);
