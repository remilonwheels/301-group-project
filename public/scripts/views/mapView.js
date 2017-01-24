'use strict';

function initMap() {
  var codefellows = {lat: 47.618217, lng: -122.351832};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: codefellows
  });

  facility.all.forEach( facility => {
    let marker = new google.maps.Marker({
      position: facility.location,
      map: map,
      label: `$${facility.rate2Hr}`
    });
    marker.addListener('click', () => {alert('ayo');})
  })
}


function queryStringify(string) {
  return string.trim().replace(/\s{3}/g, '').replace(/\s/g, '+');
}
