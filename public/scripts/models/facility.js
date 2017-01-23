'use strict';

(function(module) {
  const facility = {};

  facility.fetch = () => {
    $.getJSON('https://data.seattle.gov/api/views/3neb-8edu/rows.json')
    .then(console.log);
  }


  module.facility = facility;

})(window);
