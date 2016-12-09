var daamMap = function ( ui, state ) {
  var
  center = {
    lng: -76.61111667463689, // coordinates[0]
    lat: 39.29040310219014   // coordinates[1]
  },
  map = null,
  pins = [],
  features = {
    art: {
      icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png'
    },
    restaurant: {
      icon: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png'
    }
  },
  localSettings = { onlyShowCurrent: true };
 
  var api = {
    init: function ( ) {
      var
      center = {
        lng: -76.61111667463689, // coordinates[0]
        lat: 39.29040310219014   // coordinates[1]
      };

      map = window.map =
        new google.maps.Map(document.getElementById('map'),
                            { zoom: 14,
                              center: center,
                              styles: [] });
    },

    pin: function ( pin ) {
      pins.push({
        info: pin.info,
        pin: new google.maps.Marker(pin.options)});
      if (pin.info.center) {
        pin.options.map.setCenter(pin.options.position);
      }

      // NICE-TO-HAVE
      // ...bounds.extend(pin.position);
      // ...map.fitBounds(bounds);
    },

    unpinByType: function ( t ) {
      if (localSettings.onlyShowCurrent) {
        pins = pins.filter(function ( pin ) {
          if (pin.info.type === t) {
            pin.pin.setMap(null);
            return false;
          }
          return true;
        });
      }
    }
  };

  window.daamMapInit = api.init;


  // subscribe to system events
  state.channels.ActiveRestaurant.take(function ( r ) {
    api.unpinByType('restaurant');    
    var pinInfo = {
      options: { icon: features.restaurant.icon,
                 map: map,
                 position: {
                   lng: r.locationpoint.coordinates[0],
                   lat: r.locationpoint.coordinates[1] } },
      info: { id: r.id,
              center: true,
              type: 'restaurant' } };

    api.pin(pinInfo);
  });

  state.channels.ArtworkList.take(function ( list ) {
    api.unpinByType('art');
    if (!list) { return; }
    list.forEach(function ( a ) {
      api.pin({
        options: { icon: features.art.icon,
                   map: map,
                   position: {
                     lng: a.locationpoint.coordinates[0],
                     lat: a.locationpoint.coordinates[1] } },
        info: { id: a.id,
                type: 'art' } });
    });

    
  });

  return api;
};

// NICE-TO-HAVE
// Have map match app theming
function mapStyles ( ) {

  return [
    {elementType: 'geometry', stylers: [{color: '#333333'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#333333'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#bdbdb3'}]},
    {featureType: 'administrative.locality',
     elementType: 'labels.text.fill',
     stylers: [{color: '#bdbdb3'}]},
    {featureType: 'poi',
     elementType: 'labels.text.fill',
     stylers: [{color: '#d59563'}]},
    {featureType: 'poi.park',
     elementType: 'geometry',
     stylers: [{color: '#263c3f'}]},
    {featureType: 'poi.park',
     elementType: 'labels.text.fill',
     stylers: [{color: '#6b9a76'}]},
    {featureType: 'road',
     elementType: 'geometry',
     stylers: [{color: '#38414e'}]},
    {featureType: 'road',
     elementType: 'geometry.stroke',
     stylers: [{color: '#212a37'}]},
    {featureType: 'road',
     elementType: 'labels.text.fill',
     stylers: [{color: '#9ca5b3'}]},
    {featureType: 'road.highway',
     elementType: 'geometry',
     stylers: [{color: '#746855'}]},
    {featureType: 'road.highway',
     elementType: 'geometry.stroke',
     stylers: [{color: '#1f2835'}]},
    {featureType: 'road.highway',
     elementType: 'labels.text.fill',
     stylers: [{color: '#f3d19c'}]},
    {featureType: 'transit',
     elementType: 'geometry',
     stylers: [{color: '#2f3948'}]},
    {featureType: 'transit.station',
     elementType: 'labels.text.fill',
     stylers: [{color: '#d59563'}]},
    {featureType: 'water',
     elementType: 'geometry',
     stylers: [{color: '#17263c'}]},
    {featureType: 'water',
     elementType: 'labels.text.fill',
     stylers: [{color: '#515c6d'}]},
    {featureType: 'water',
     elementType: 'labels.text.stroke',
     stylers: [{color: '#17263c'}]}
  ];
}
