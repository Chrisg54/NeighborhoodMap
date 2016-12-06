var map;
var infowindow;

// The default model's data
var startlocations = [
						{location: "Buckingham Fountain", uluru: {lat: 41.876683, lng: -87.618896}, marker: {}},
						{location: "Chicago Cultural Center", uluru: {lat: 41.884703, lng: -87.624947}, marker: {}},
						{location: "Harold Washington Library", uluru: {lat: 41.877993, lng: -87.628809}, marker: {}},
						{location: "Millennium Park", uluru: {lat: 41.882722, lng: -87.622415}, marker: {}},
						{location: "Willis Tower", uluru: {lat: 41.879132, lng: -87.635904}, marker: {}},
						{location: "Wrigley Field", uluru: {lat: 41.949428, lng: -87.655376}, marker: {}}
					];

var viewmodel = new ViewModel();

const REDICON = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
const GREENICON = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';


// Start Knockout Functions
function ViewModel() {
    var self = this;
	
	self.filterstring = ko.observable("");
    self.locations = ko.observableArray(startlocations); 

    // Provides the functionality for the filtering in the left pane.
    filter = function() { 
    	hideErrors();

    	var input = this.filterstring();

		// Reset the list observable to no locations
		self.locations([]);

		// If the user blanks out the filter input then reset the observable array to the default model's data.
		if (input === "")
		{
			self.locations(startlocations);
			return true;
		}

		// Add locations if the search term entered by the user is found within the abservable locations list array.
    	startlocations.forEach(function(location) {
			if (location.location.toUpperCase().indexOf(input.toUpperCase()) > -1) {
				self.locations.push(location);
			}
		});

		return true;
    }

    activateMarker = function(location) {
    	var marker = createMarker(location, GREENICON);
    }
}

// Activates knockout.js
ko.applyBindings(viewmodel);
// End Knockout Functions

// Start Map Functions
// Initiats the Google map and add the markers for each location from the observable array.
function initMap() {
	// Create a map object and specify the DOM element for display.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 41.881732, lng: -87.623444},
	  scrollwheel: false,
	  zoom: 15
	});

	startlocations.forEach(function(location) {
		var marker = createMarker(location, REDICON);
		location.marker = marker;
	}); 

	infowindow = new google.maps.InfoWindow({content: "", maxWidth: 150});	
}

// Handle an error from the map.
function mapError() {
	$("#map-error").show();
}

// Close all error messages.
function hideErrors() {
	$(".error").hide();	
}

// Adds markers to the Google map.
function createMarker(location, iconpath) {
  var latLng = new google.maps.LatLng(location.uluru.lat,location.uluru.lng);
  var marker = new google.maps.Marker({
  	title:location.location,
    position: latLng,
    icon: iconpath,
    map: map
  });
  marker.addListener('click', toggleMarker);
  return marker;
}

// Toggles the marker red or green when the user clicks the location within the list or the marker itself.
function toggleMarker(marker) {
	hideErrors();
	startlocations.forEach(function(location) {
		location.marker.setIcon(REDICON);
		location.marker.setMap(map);
	});

	var mapLatlng;

	if (marker.marker) {
		marker.marker.setIcon(GREENICON);
		marker.marker.setMap(map);
		mapLatlng = marker.uluru;
		map.setCenter(mapLatlng);
		$("#left-pane").addClass("hide-pane");	
        openInfoWindow(encodeURI(marker.location), marker.marker);	
	}
	else {
		this.icon = GREENICON;
		openInfoWindow(encodeURI(this.title), this);
	}
}

// Opens the info window for the selected marker.
function openInfoWindow(title, marker) {
	$.ajax({
        type: 'GET',
        dataType: 'jsonp',
		url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + title
	})
	.done(function( data ) {
		for (var key in data.query.pages) {
		   //console.log(' name=' + key + ' value=' + data.query.pages[key]);
		   var firstPeriod = data.query.pages[key].extract.indexOf(".") + 1;

		   infowindow.setContent(data.query.pages[key].extract.substr(0, firstPeriod));
		   infowindow.open(map, marker);

		   return;
		}
	})
	.fail(function(e) {
		$("#wiki-error").show();
	});
}
// End Map Functions


// Start Misc Functions
$( document ).ready(function() {
	$( "#hamburger" ).on( "click", function() {
		$("#left-pane").toggle();
		$("#left-pane").removeClass("hide-pane");		
	});	
});
// End Misc Functions
