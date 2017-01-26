'use strict';

(function(module){
  const mapView = {};
  var codefellows = {lat: 47.618217, lng: -122.351832};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: codefellows
  });
  mapView.facilityMarkers = [];

  mapView.makeMapMarkers = (zzRatezz) => {
      facility.all.forEach(facility => {
        // if(facility[zzRatezz]){
          if(facility[zzRatezz] <= 9){
            let marker = new google.maps.Marker({
              position: facility.location,
              map: map,
              label: {
                color: 'white',
                text:`$${facility[zzRatezz]}`
              },
              icon:{
                anchor: new google.maps.Point(16, 16),
                url: `data:image/svg+xml;utf-8, \
                <svg uid="${facility.id}" width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
                <path fill="green" stroke="green" stroke-width="1" d="M3.5 3.5h25v25h-25z" ></path> \
                </svg>`
              },
              id: `facility.id`
            });
            marker.addListener('click', () => {
              infowindow.open(map, marker);
            });
            mapView.facilityMarkers[facility.id] = marker;
            if (!facility[zzRatezz]) {
              console.log('in');
              marker.setVisible(false);
            }
          }
          if(facility[zzRatezz] > 9){
            let marker = new google.maps.Marker({
              position: facility.location,
              map: map,
              label: {
                color: 'red',
                text:`$${facility[zzRatezz]}`
              },
              icon:{
                anchor: new google.maps.Point(16, 16),
                url: 'data:image/svg+xml;utf-8, \
                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"> \
                <circle cx="14" cy="14" r="14" stroke="black" fill="black" /> \
                </svg>'
              }
            });
            marker.addListener('click', () => {
              infowindow.open(map, marker);
            });
            mapView.facilityMarkers[facility.id] = marker;

            if (!facility[zzRatezz]) {
              console.log('in');
              marker.setVisible(false);
            }
          }


          var contentString = `<h4>${!facility.facilityName ? 'unknown' : facility.facilityName}</h4><p>${facility.addressFull}</p><h6>Hours</h6><p>${!facility.hoursMF ? 'unknown' : facility.hoursMF}</p><h6>Weekend Hrs</h6><p>SAT: ${!facility.hoursSat ? 'N/A' : facility.hoursSat}</p><p>SUN: ${!facility.hoursSun ? 'N/A' : facility.hoursSun}</p><h6>Price</h6><p> ${facility[zzRatezz]}</p>`;

          var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
          });
        // }
      });
    }

  mapView.initMapView = () => {

    mapView.makeMapMarkers('rate2Hr');
    makeAddressSearchBar();

    function makeAddressSearchBar() {

      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });
      var markers = [];
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log('Returned place contains no geometry');
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }

    $('#rate-change-button-1hr').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rate1Hr');
    });
    $('#rate-change-button-2hr').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rate2Hr');
    });
    $('#rate-change-button-3hr').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rate3Hr');
    });
    $('#rate-change-button-day').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rateDay');
    });
  }

  module.mapView = mapView;
})(window)

function queryStringify(string) {
  return string.trim().replace(/\s{3}/g, '').replace(/\s/g, '+');
}
