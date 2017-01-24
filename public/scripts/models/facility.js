'use strict';

(function(module) {
  console.log('in model');

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

  facility.fetch = () => {
    $.getJSON('https://data.seattle.gov/api/views/3neb-8edu/rows.json')
    .then( dataObject =>  {
      dataObject.data.forEach(facility => new Facility(facility));
    });
  }

  module.facility = facility;
})(window);
