var project = {};
project.api = { 

    clientId : 'SWLN1TKMJHMOQTKUBDK34AWO3HU455FYWJH030UTGFZOQ4BZ',
    clientSecret:'GH4H3R32U4YSKBEAIT4YVMXGUJZ1EB2MJTVIQ4OJOZOI1WIF',

}

function initMap(){    


    project.myLatLng = {"lat":41.753549,"lng":-88.019696};

    project.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: project.myLatLng,
        style:styles
    });




    ko.applyBindings(new AppViewModel());
}

function AppViewModel() {
    'use strict'
    
    var self = this;

    self.markers = [];

    self.createMarker = function(place) {
        var loc = place.location;

        var marker = new google.maps.Marker({
            position: { lat: loc.lat, lng : loc.lng },
            map:   project.map ,
            draggable: true,
          animation: google.maps.Animation.DROP,
            title: place.title,
            
        });        
        
        
        self.markers.push(marker);
        return marker;

    } 


var infowindow = new google.maps.InfoWindow();

    self.locations = ko.observableArray(locationMarker);
    self.searchTerm = ko.observable(); // property to store the filter

    self.filterLocations = ko.computed(function() {
        if(!self.searchTerm()) {
            return self.locations(); 
        } else {
            return ko.utils.arrayFilter(self.locations(), function(loc) {
                return loc.title.search( self.searchTerm()) > -1 ;
            });
        }
    });


    self.filterMarkers = ko.computed(function() {
        self.markers.forEach(function(marker) {marker.setMap(null)});
        self.markers = [];                       
        return ko.utils.arrayFilter(self.filterLocations(), function(loc) {

            return self.createMarker(loc);
        });        
    });


    self.displayLabel =function (marker,place ) {

        var loc = place.location;                
        var url='https://api.foursquare.com/v2/venues/search?ll='+loc.lat+','+loc.lng+'&client_id='+project.api.clientId+'&client_secret='+project.api.clientSecret+'&v=20180514&query='+place.title;


        $.ajax({
            url:url,
            datatype:"json"
        }).done(function(data){
        

            var result = data.response.venues[0];


            marker.addListener('click', function() {
                
                

                
                var street=result.location.formattedAddress[0]?self.street=result.location.formattedAddress[0]:"Not Found";
                var city=result.location.formattedAddress[1]?result.location.formattedAddress[1]:"Not Found"
                var food =result.categories[0].name;
                var imgprefix =result.categories[0].icon.prefix;
                var imgsuffix=result.categories[0].icon.suffix;
               

                var contentString = '<div class=infoWindow ><div id="title" ><strong>'+place.title+'</strong>'+
                    '<div class ="content">'+street+'</div>'+
                    '<div class ="content">'+city+'</div>'+
                   '<div class="content"><b>'+food+'</b></div></div>'+
                    '<div class="content"><a href="'+imgprefix+'.'+imgsuffix+'">'+imgprefix+'.'+imgsuffix+'</a></div></div>';

                infowindow = new google.maps.InfoWindow({ 
                    content: contentString
                    
                });               

                infowindow.open(project.map, this);
                marker.getAnimation!==null;;
                    marker.setAnimation===null;
                marker.setAnimation(google.maps.Animation.BOUNCE);
                
            setTimeout(function() {
            marker.setMap(null);    
            marker.setAnimation(null);
        }, 4500);
    });

           

            
            google.maps.event.trigger(marker, 'click');

        }).fail(function(){
            alert("there is is a problem with four square api please try again later");
        });
    }



    self.clickLocation = function(place) {
        
        var marker = self.createMarker(place);
        self.displayLabel(marker,place );

    }
    
    
}
