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
    console.log('in rate jam');
    if( facility.all ) {
      $(`#rate-change-button-${ctx.params.rateTime}`).trigger('click');
    }
    else console.log('ayo');
  }



  module.mapController = mapController;
})(window);

function initIndex () {
  // page();
  mapView.initMapView();
}
