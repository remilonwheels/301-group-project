'use strict';

(function(module){
  let mapController = {};

  mapController.index = () => {
    $(facility.fetch(mapView.initMapView));
  }

  module.mapController = mapController;
})(window);
