print = console.log.bind(console);
identity = function ( I ) { return I; };

window.initMapView = (function ( state ) {
  return function ( ) {
    var
    center = {
      lng: -76.61111667463689, // coordinates[0]
      lat: 39.29040310219014   // coordinates[1]
    },
    map = window.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: center,
      styles: [
        // {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        // {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        // {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        // {featureType: 'administrative.locality',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#d59563'}]},
        // {featureType: 'poi',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#d59563'}]},
        // {featureType: 'poi.park',
        //  elementType: 'geometry',
        //  stylers: [{color: '#263c3f'}]},
        // {featureType: 'poi.park',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#6b9a76'}]},
        // {featureType: 'road',
        //  elementType: 'geometry',
        //  stylers: [{color: '#38414e'}]},
        // {featureType: 'road',
        //  elementType: 'geometry.stroke',
        //  stylers: [{color: '#212a37'}]},
        // {featureType: 'road',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#9ca5b3'}]},
        // {featureType: 'road.highway',
        //  elementType: 'geometry',
        //  stylers: [{color: '#746855'}]},
        // {featureType: 'road.highway',
        //  elementType: 'geometry.stroke',
        //  stylers: [{color: '#1f2835'}]},
        // {featureType: 'road.highway',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#f3d19c'}]},
        // {featureType: 'transit',
        //  elementType: 'geometry',
        //  stylers: [{color: '#2f3948'}]},
        // {featureType: 'transit.station',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#d59563'}]},
        // {featureType: 'water',
        //  elementType: 'geometry',
        //  stylers: [{color: '#17263c'}]},
        // {featureType: 'water',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#515c6d'}]},
        // {featureType: 'water',
        //  elementType: 'labels.text.stroke',
        //  stylers: [{color: '#17263c'}]}
      ]
    });

    // var marker = new google.maps.Marker({
    //   position: center,
    //   map: map
    // });

  };
}());

window.daam = (function ( ui, state ) {

  resizeDisplay(window.innerHeight, window.innerWidth);
  window.onresize = function ( e ) {
    resizeDisplay(e.target.innerHeight,
                  e.target.innerWidth);
  };

  function resizeDisplay ( wHeight, wWidth ) {
    ui.select('#app').style('height', wHeight + 'px');
    ui.select('#map').style('width', function ( ) {
      return Math.round(wWidth / 2) + 'px';
    });

    ui.select('.workspace')
      .style('height', wHeight + 'px')
      .style('width', function ( ) {
        return Math.round(wWidth /2) + 'px';
      });
  }

  var openSettings = ui.select('#settings-open')
      .on('click', function ( ) {
        ui.select('#settings').style('display', 'block');
        ui.select('.top.banner').style('display', 'none');
        ui.select('#restaurants').style('display', 'none');
        ui.select('#murals').style('display', 'none');
      });

  var search = ui.select('#search')
      .on('input', function ( ) {
        var v = this.value;
        if (v.length > 2) {
          daamRestaurants.search(v); }
      });

 // window.daamRestaurants(d3, {
 //   Search: state.channels.Search,
 //   ActiveRestaruant: state.channels.ActiveRestaruant,
 //   RestaurantList: state.channels.RestaurantList
 // });


})(d3,
   {
     Restaurants: daamRestaurants,
     channels: {
       Search:           channel(),
       ActiveRestaruant: channel(),
       RestaurantList:   channel(),
       ArtworkList:      channel()
     }
   });
