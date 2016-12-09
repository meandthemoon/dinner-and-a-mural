window.daamRestaurants = function ( ui, state ) {
  
  var // UI
  restaurants = ui.select('#restaurants')
    .style('display', 'none'),

  // elements displaying selected restaurant
  activeContainer = restaurants
    .append('div')
    .attr('class', 'r-active-view-c'),
  activeHeading = activeContainer
    .append('p')
    .attr('class', 'r-viewing')
    .text('Currently Viewing'),
  activeView = activeContainer
    .append('table')
    .attr('class', 'r-active-view')
    .append('tbody')
    .append('tr'), // selected restaurant

  // displays for searched-for or "no-results..."
  listsContainer = restaurants.append('div')
    .attr('class', 'list-views'),
  emptyView = listsContainer.append('div')
    .style('display', 'none')
    .attr('class', 'nothing-found')
    .text('... no results');

  var listViewTable = daamDataTable({
    owner: listsContainer.append('table').attr('class', 'rtd'),
    tableOptions: {
      row: {
        class: 'clickable',
        click: function ( d ) {
          if (!d.locationpoint) { return; } // ...
          state.channels.ActiveRestaurant.put(d);
          restaurants.style('display', 'block');
        }
      },
      column: [{ heading: 'Restaurant',
                 dataKey: 'name',
                 class:   'r-name' },
               { heading: 'Address',
                 dataKey: 'location_1_location',
                 class:   'r-address' },
               { heading: 'Neighborhood',
                 dataKey: 'neighborhood',
                 class:   'r-hood' }]
    }
  });

  // "component" state
  var cState = { xhr: null };

  var api = {
    // search for restaurants via <input>
    search: (function ( ) {
      var
      parseJson = function ( xhr ) {
        return JSON.parse(xhr.responseText);
      },
      path = '/api/restaurants/search/';

      return function restarauntSearch ( searchStr ) {
        if (cState.xhr) { cState.xhr.abort(); }

        cState.xhr = ui.request(path+searchStr)
          .header('Content-Type', 'application/json')
          .response(parseJson)
          .get(function ( error, results ) {
            if (!error) {
              state.channels.RestaurantList.put(results);
            } else {
              alert(' HTTP ERROR - Restaurants are broken :('); }
          });
      };
    }()),

    // by clicking or location.hash
    getById: (function ( ) {
      var
      parseJson = function ( xhr ) {
        return JSON.parse(xhr.responseText);
      },
      path = '/api/restaurants/';

      return function ( id ) {
        if (cState.xhr) { cState.xhr.abort(); }

        cState.xhr = ui.request(path+String(id))
          .header('Content-Type', 'application/json')
          .response(parseJson)
          .get(function ( error, results ) {
            if (!error) {
              var restaurant = results[0] || {};
              restaurants.style('display', 'block');
              state.channels.ActiveRestaurant.put(restaurant);
            } else {
              alert(' HTTP ERROR - Restaurants are broken :('); }
          });
      };
    }()),

    render: function ( data ) {
      if (data) {
        restaurants.style('display', 'block'); }

      listViewTable.render(data);
    }

  };

  state.channels.Search.take(api.search);
  state.channels.RestaurantGet.take(api.getById);
  state.channels.RestaurantList.take(api.render);

  daamActiveRestaurant(ui, state);
  api.render();

  return api;

  // child component(s)
  function daamActiveRestaurant ( ui, state ) {
    var api = {
      render: function render ( d ) {
      var cells = activeView
            .selectAll('td')
            .data([d.name,
                   d.location_1_location,
                   d.neighborhood]);

        cells.enter()
          .append('td')
          .attr('class', function ( d, i ) {
            return i === 0 ? 'r-name' : '';
          })
          .text(String);

        cells.text(String);
      }
    };

    state.channels.ActiveRestaurant.take(api.render);

    return api;
  }

};
