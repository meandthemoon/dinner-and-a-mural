print = console.log.bind(console);
identity = function ( I ) { return I; };

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

  // ........ combine handlers ( toggle fn )................
  var openSettings = ui.select('#settings-open')
      .on('click', function ( ) {
        ui.select('#settings').style('display', 'block');
        ui.select('.top.banner').style('display', 'none');
        ui.select('#restaurants').style('display', 'none');
        ui.select('#murals').style('display', 'none');
      });
  var closeSettings = ui.select('#settings-close')
      .on('click', function ( ) {
        ui.select('#settings').style('display', 'none');
        ui.select('.top.banner').style('display', 'block');
        ui.select('#restaurants').style('display', 'block');
        ui.select('#murals').style('display', 'block');
      });
  // .......................................................

  var search = ui.select('#search')
      .on('input', function ( ) {
        if (this.value.length < 3) { return; }
        state.channels.Search.put(this.value); 
      });

  window.daamMap(
    d3,
    { channels: { ActiveRestaurant: state.channels.ActiveRestaurant,
                  ArtworkList: state.channels.ArtworkList }});

  window.daamMurals(
    d3,
    { channels: { ActiveRestaurant: state.channels.ActiveRestaurant,
                  ArtworkList: state.channels.ArtworkList,
                  RestaurantList: state.channels.RestaurantList,
                  Search: state.channels.Search }});
  
  window.daamRestaurants(
    d3,
    { channels: { Search: state.channels.Search,
                  ActiveRestaurant: state.channels.ActiveRestaurant,
                  RestaurantGet: state.channels.RestaurantGet,
                  RestaurantList: state.channels.RestaurantList }});

  // I don't want jQuery just to have this router
  //  - use small lib ( page.js )
  var routing = Sammy('#app', function ( ) {
    this.get('#/', function ( ) { });

    this.get('#/restaurants/:id', function ( ) {
      state.channels.RestaurantGet.put(this.params.id);
    });

  });

  state.channels.ActiveRestaurant.take(function ( r ) {
    routing.setLocation('#/restaurants/'+r.id);
  });

  // start the application
  routing.run('#/');

  setInterval(
    (function ( i, a ) {
      return function ( ) {
        i = (++i >= a.length ? 0 : i);
        ui.select('body').style('background-image', a[i]);
      };
    })(0, ["url('/images/221_Pulaski_M._Santos.JPG')",
           "url('/images/hands.JPG')",
           "url('/images/ferguson-ramsay___monroe_sts.JPG')"]),
    5000);

})(d3,
   { channels: { ActiveRestaurant: channel(),
                 ArtworkList:      channel(),
                 RestaurantGet:    channel(),
                 RestaurantList:   channel(),
                 Search:           channel(),
                 Settings:         channel() },
     defaultSettings: { muralRange: 'zip',
                        rotateImages: true,
                        opacity: 0.9 }
   });
