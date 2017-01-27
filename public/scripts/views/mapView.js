'use strict';

(function(module){
  const mapView = {};
  var codefellows = {lat: 47.618217, lng: -122.351832};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: codefellows
  });


  mapView.facilityMarkers = [];

  $('#legend').html(`<svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <path fill="green" stroke="green" stroke-width="1" d="M3.5 3.5h25v25h-25z" ></path></svg> Right Price
  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
  <circle cx="14" cy="14" r="14" stroke="black" fill="black" />
  </svg> Too Much`);
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push($('#legend')[0]);

  mapView.makeMapMarkers = (zzRatezz, filterRate) => {
    mapView.facilityMarkers.forEach(marker => marker.setMap(null));
    mapView.facilityMarkers = [];

      facility.all.forEach(facility => {
        if(facility[zzRatezz] <= filterRate){
          let marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
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
        if(facility[zzRatezz] > filterRate){
          let marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: facility.location,
            map: map,
            label: {
              color: '#FF0009',
              text:`$${facility[zzRatezz]}`
            },
            icon:{
              anchor: new google.maps.Point(16, 16),
              url: 'data:image/svg+xml;utf-8, \
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"> \
              <circle cx="14" cy="14" r="14" stroke="black" fill="black" /> \
              </svg>'
            },
            zIndex: 10
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

// <h4>${!facility.facilityName ? 'unknown' : facility.facilityName}</h4>
        var contentString = `
        <h4>${facility.facilityName ? facility.facilityName : (facility.opName ? facility.opName : 'unknown')}</h4>
        <p>${facility.addressFull}</p>
        <p class="margin-bottom-zero"><span class="bold">M-F</span> ${!facility.hoursMF ? 'unknown' : facility.hoursMF}</p>
        <p class="margin-bottom-zero"><span class="bold">SAT</span> ${!facility.hoursSat ? 'unknown' : facility.hoursSat}</p>
        <p><span class="bold">SUN</span> ${!facility.hoursSun ? 'unknown' : facility.hoursSun}</p>
        <p class="margin-bottom-zero"><span class="bold">1HR</span> $${!facility.rate1Hr ? ' unknown' : facility.rate1Hr}</p>
        <p class="margin-bottom-zero"><span class="bold">2HR</span> $${!facility.rate2Hr ? ' unknown' : facility.rate2Hr}</p>
        <p class="margin-bottom-zero"><span class="bold">3HR</span> $${!facility.rate3Hr ? ' unknown' : facility.rate3Hr}</p>
        <p><span class="bold">DAY</span> $${!facility.rateDay ? ' unknown' : facility.rateDay}</p>`;

        var infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });
      });
    }

  mapView.initMapView = () => {

    mapView.makeMapMarkers('rate2Hr', 9);
    makeAddressSearchBar();

    function makeAddressSearchBar() {

      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });
      var markers = [];
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        console.log(places);
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
            animation: google.maps.Animation.BOUNCE,
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

          map.setCenter(place.geometry.location);
          map.setZoom(17);
        });
        // map.fitBounds(bounds);
      });
    }

    $('#rate-change-button-1hr').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rate1Hr', 6);
    });
    $('#rate-change-button-2hr').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rate2Hr', 9);
    });
    $('#rate-change-button-3hr').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rate3Hr', 12);
    });
    $('#rate-change-button-day').on('click', () => {
      mapView.facilityMarkers.forEach(marker => marker.setMap(null));
      mapView.makeMapMarkers('rateDay', 15);
    });
  }

  module.mapView = mapView;
})(window)

function queryStringify(string) {
  return string.trim().replace(/\s{3}/g, '').replace(/\s/g, '+');
}
