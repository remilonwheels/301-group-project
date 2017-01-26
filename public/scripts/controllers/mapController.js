'use strict';

(function(module){
  let mapController = {};

  mapController.index = () => {
    $(facility.fetch(mapView.initMapView));
  }

  // mapController.changeFacilityRates() = {
  //
  // }



  module.mapController = mapController;
})(window);
