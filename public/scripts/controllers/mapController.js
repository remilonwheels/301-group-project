'use strict';

(function(module){
  let mapController = {};

  mapController.index = () => {
    $('section').hide();
    // $(facility.fetch(mapView.initMapView));
    $('#home').show();
  }

  // mapController.changeFacilityRates() = {
  //
  // }



  module.mapController = mapController;
})(window);
