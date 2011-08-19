var geocoder;
var map;         
var defaultLat = 30.26;
var defaultLng = -97.73; 
var defaultZoom = 12;

var markers = [];        
var infoWindows = [];
var contentRows = [];   

function initializeGeo() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(defaultLat,defaultLng);
  var myOptions = {
    zoom: defaultZoom,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  } 

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

  // Add markers to the map!   
  requestUrl = "/places?lat=" + defaultLat + "&lng=" + defaultLng;
  $.post(requestUrl, function(data) { addMarkers(data); });
}

function geocodeAddress() {
  var address = document.getElementById("address").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(12);
      requestUrl = "/places?lat=" + results[0].geometry.location.lat() + "&lng=" + results[0].geometry.location.lng();

      $.post(requestUrl, function(data) { addMarkers(data); });

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
      
function addMarkers(data) {
  for (var i = 0; i < 40; i++) {    
    if (typeof(data.results[i]) == "undefined") { break; }
    var title = data.results[i].title;
    var description = data.results[i].abstract;
    var url = data.results[i].url;
    addMarker(data.results[i].coordinates[1],data.results[i].coordinates[0],title,'h',description,url);
  }
}

function addMarker(lat,lng,title,type,description,url) {
  var myLatlng = new google.maps.LatLng(lat, lng);
  var markerImage = '/images/marker.png';

  // Marker
  var marker = new google.maps.Marker({
    position: myLatlng,
    title:title,
    icon: markerImage
  });                                           

  marker.setMap(map);    
  markers.push(marker);  

  // infoWindow
  infoDescription = "<div class=infobubble-content><h3>" + title + "</h3><p>" + description + "</p></div><div class=infobubble-footer><a href=" + url + " target=_blank>Read more on Wikipedia &raquo;</a></div>";    

  var infoWindow = new google.maps.InfoWindow({
    content: infoDescription
  });

  infoWindows.push(infoWindow);

  // Sidebar content  
  var contentRow = "<div class=\"content-row\"><p><strong>" + title + "</strong>" + description + "</p></div>";    

  contentRows.push(contentRow);

  google.maps.event.addListener(marker, 'click', function() {
    removeMarkers();
    infoWindow.open(map,marker);
  });
}

function removeMarkers() {
  for (var i = 0; i < infoWindows.length; i++) {  
    infoWindows[i].close();
  }      
}