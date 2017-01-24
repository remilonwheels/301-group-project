'use strict';

function initMap() {
  var codefellows = {lat: 47.618217, lng: -122.351832};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: codefellows
  });
  var marker = new google.maps.Marker({
    position: codefellows,
    map: map
  });
  var marker2 = new google.maps.Marker({
    position: {lat: 47.636806, lng: -122.341730},
    map: map
  });
}

if(!localStorage.practiceAddress){
  $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=3215+South+47th+St+Tacoma,+WA+98409&key=AIzaSyCI5Y7sWLEb4ullGAaSJDbHHYv2-wPCyUI')
  .then(locationObject => {
    localStorage.practiceAddress = JSON.stringify(locationObject);
    console.log(locationObject);
  });
}

console.log(JSON.parse(localStorage.practiceAddress).results[0].geometry.location);


function queryStringify(string) {
  return string.trim().replace(/\s/g, '+');
}

//Working but need to put it in callback chain
// $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryStringify(facility.all[0].addressFull)}&key=AIzaSyCI5Y7sWLEb4ullGAaSJDbHHYv2-wPCyUI`)
// .then(locationObject => {
//   console.log(locationObject);
// });
