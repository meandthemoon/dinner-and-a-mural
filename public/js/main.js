print = console.log.bind(console);
identity = function ( I ) { return I; };

window.daam = (function ( ui, state ) {

  // application-level dependency helper
  var deps = {
    async: { map: false,
             artworks: false },
    loaded: function ( ) {
      var async = this.async;
      return Object
        .keys(async)
        .every(function ( key ) {
          return async[key];
        });
    }
  };

  var userSettings = (function ( visited, presets ) {
    if (!visited) {
      localStorage.setItem('d_a_m', new Date().toISOString());
      localStorage.setItem('muralRange', presets.muralRange);
      localStorage.setItem('rotateImages', presets.rotateImages);
    } 
    return {
      d_a_m: localStorage.getItem('d_a_m'),
      muralRange: localStorage.getItem('muralRange'),
      rotateImages: localStorage.getItem('rotateImages'),
    };
  }(localStorage.getItem('d_a_m'), state.defaultSettings));

  function okLaunch ( ) {
    initRouting();
    initUI();
  }

  function initUI ( ) {

    function getListViewHeight ( ) {
      return window.innerHeight / 2 - 190;
    }

    resizeDisplay(window.innerHeight, window.innerWidth);
    window.onresize = function ( e ) {
      resizeDisplay(e.target.innerHeight,
                    e.target.innerWidth);
    };

    function resizeDisplay ( wHeight, wWidth ) {
      ui.select('#app').style('height', wHeight + 'px');
      ui.select('#map').style('width', function ( ) {
        return Math.floor(wWidth / 2) + 'px';
      });

      ui.select('.workspace')
        .style('height', wHeight + 'px')
        .style('width', function ( ) {
          return Math.round(wWidth /2) + 'px';
        });

      ui.selectAll('.list-views')
        .style('max-height', getListViewHeight() + 'px');
    }

    // .......................................................
    // user preferences
    var openSettings = ui.select('#settings-open')
        .on('click', function ( ) {
          ui.select('#settings').style('display', 'block');
        });

    var closeSettings = ui.select('#settings-close')
        .on('click', function ( ) {
          ui.select('#settings').style('display', 'none');
        });

    ui.select('#setting-rotateImages')
      .on('click', function ( ) {
        localStorage.setItem('rotateImages', this.checked);
        toggleImageRotation();
      })
      .node()
      .checked = userSettings.rotateImages === 'true' ? true : false;

    // others not supported yet...
    ui.select('#setting-search-zip')
      .node()
      .checked = true;

    // background rotation
    // wrap in fn
    var toggleImageRotation = (function ( initRot ) {
      return function ( ) {
        if (initRot.process) {
          clearInterval(initRot.process);
          initRot.process = null;
          ui.select('body').style('background-image', 'none');
          return;
        }
        initRot.process = setInterval(
          (function ( i, a ) {
            return function ( ) {
              i = (++i >= a.length ? 0 : i);
              ui.select('body').style('background-image', a[i]);
            };
          })(0, ["url('/images/221_Pulaski_M._Santos.JPG')",
                 "url('/images/hands.JPG')",
                 "url('/images/ferguson-ramsay___monroe_sts.JPG')",
                 "url('/images/miller-north-ave.jpg')",
                 "url('/images/NicholasTolls.jpg')",
                 "url('/images/M._Todd_FM_07.jpg')",
                 "url('/images/P._Mason_Farmers_Market.jpg')"]),
          5000);
      };
    }({ process: null }));

    if (userSettings.rotateImages === 'true') {
      toggleImageRotation();
    }

    // .......................................................
    
    var search = ui.select('#search')
        .on('input', function ( ) {
          if (this.value.length < 3) { return; }
          state.channels.Search.put(this.value); 
        });

    ui.select('.load-mask')
      .transition()
      .delay(1500)
      .duration(800)
      .style('opacity', '0')
      .transition()
      .remove();
  }

  function initRouting ( ) {
    // routing ...............................................
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
    
    routing.run('#/');
    // routing ...............................................
  }

  // initialize components with dependencies &
  // communication channels
  var mapComponent = window.daamMap(
    d3,
    { channels: { ActiveRestaurant: state.channels.ActiveRestaurant,
                  ArtworkList: state.channels.ArtworkList },
      owner:      ui.select('#map') }),

  artworkComponent = window.daamMurals(
    d3,
    { channels: { ActiveRestaurant: state.channels.ActiveRestaurant,
                  ArtworksReady: state.channels.ArtworksReady,
                  ArtworkList: state.channels.ArtworkList,
                  RestaurantList: state.channels.RestaurantList,
                  Search: state.channels.Search },
      owner:      ui.select('#murals') });
  
  restaurantComponent = window.daamRestaurants(
    d3,
    { channels: { Search: state.channels.Search,
                  ActiveRestaurant: state.channels.ActiveRestaurant,
                  RestaurantGet: state.channels.RestaurantGet,
                  RestaurantList: state.channels.RestaurantList },
      owner:      ui.select('#restaurants') });

  state.channels.ArtworksReady.take(function artReadyLaunch ( val ) {
    deps.async.artworks = val;
    if (deps.loaded()) { okLaunch(); }
  });

  var api = {
    // google maps callback fn
    mapInit: function mapInit ( dep ) {
      deps.async.map = true;
      mapComponent.init();
      if (deps.loaded()) { okLaunch();}
    }.bind(null, 'map')
  };

  return api;

})(d3,
   { channels: { ActiveRestaurant: channel(),
                 ArtworkList:      channel(),
                 ArtworksReady:    channel(),
                 RestaurantGet:    channel(),
                 RestaurantList:   channel(),
                 Search:           channel(),
                 Settings:         channel() },
     defaultSettings: { muralRange: 'zip',
                        rotateImages: true,
                        opacity: 0.9 }
   });
