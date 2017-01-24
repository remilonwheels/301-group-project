'use strict';

function initMap() {
  var codefellows = {lat: 47.618217, lng: -122.351832};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: codefellows
  });

  facility.all.forEach( facility => {
    if(!(isNaN(facility.rate2Hr))){
      let marker = new google.maps.Marker({
        position: facility.location,
        map: map,
        label: `$${facility.rate2Hr}`
      });
      var contentString = `<h4>${!facility.facilityName ? 'unknown' : facility.facilityName}</h4><p>${facility.addressFull}</p><h6>Hours</h6><p>${!facility.hoursMF ? 'unknown' : facility.hoursMF}</p><h6>Weekend Hrs</h6><p>SAT:${!facility.hoursSat ? 'N/A' : facility.hoursSat}</p><p>SUN:${!facility.hoursSun ? 'N/A' : facility.hoursSun}</p>`; 

        var infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });
      marker.addListener('click', () => {infowindow.open(map, marker);
      })
    }
  });
}


function queryStringify(string) {
  return string.trim().replace(/\s{3}/g, '').replace(/\s/g, '+');
}
