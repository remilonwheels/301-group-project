'use strict';

(function(module){
  let mapController = {};

  mapController.index = () => {
    $('section').hide();
    $(facility.fetch(initIndex));
    facility.all = [];
    $('#home').show();
  }

  mapController.rate = (ctx) => {
    $('section').hide();
    console.log('in rate jam');

    console.log(facility.all);

    facility.fetch()(mapView.makeMapMarkers,`rate${ctx.params.rate}`, 15);

    $('#home').show();
  }



  module.mapController = mapController;
})(window);

function initIndex () {
  // page();
  mapView.initMapView();
}
