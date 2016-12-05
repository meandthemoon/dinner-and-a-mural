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
          state.channels.Search.put(v); }
      });

  window.daamMap(
    d3,
    { channels: { ActiveRestaurant: state.channels.ActiveRestaurant,
                  ArtworkList: state.channels.ArtworkList }});
  
  window.daamRestaurants(
    d3,
    { channels: { Search: state.channels.Search,
                  ActiveRestaurant: state.channels.ActiveRestaurant,
                  RestaurantList: state.channels.RestaurantList }});

  window.daamMurals(
    d3,
    { channels: { ActiveRestaurant: state.channels.ActiveRestaurant,
                  ArtworkList: state.channels.ArtworkList,
                  RestaurantList: state.channels.RestaurantList,
                  Search: state.channels.Search }});

  

})(d3,
   {  channels: { ActiveRestaurant: channel(),
                  ArtworkList:      channel(),
                  RestaurantList:   channel(),
                  Search:           channel(),
                  Settings:         channel() }});
