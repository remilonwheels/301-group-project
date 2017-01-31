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
    if( facility.all.length === 0) {
      console.log(facility.fetch());
      console.log(mapView.makeMapMarkers());

      facility.fetch()(ayo => console.log('ayo', facility.all));

      // facility.fetch()(mapView.makeMapMarkers()());




      // (mapView.makeMapMarkers())(`rate${ctx.params.rate}`, 15);



      // (`rate${ctx.params.rate}`, 15);



    }
    $('#home').show();
  }



  module.mapController = mapController;
})(window);

function initIndex () {
  // page();
  mapView.initMapView();
}
