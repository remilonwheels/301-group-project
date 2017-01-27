'use strict';

(function(module) {
  const aboutController = {};

  aboutController.index = () => {
    $('section').hide();
    mapView.facilityMarkers.forEach(marker => marker.setMap(null));
    $('#about-us').show();
  };

  module.aboutController = aboutController;
})(window);
