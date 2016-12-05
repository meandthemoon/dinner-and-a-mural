window.daamRestaurants = function ( ui, state ) {
  var // UI
  restaurants = ui.select('#restaurants'),
  tableView = restaurants.append('div').append('table'),
  thead = tableView.append('thead')
    .append('tr')
    .selectAll('td')
    .data(['Restaurant', 'Address', 'Neighborhood'])
    .enter().append('td').text(String),
  emptyView = restaurants.append('div')
    .style('display', 'none')
    .attr('class', 'nothing-found')
    .text('... no results'),
  viewBody = tableView.append('tbody');

  var api = {
    // search for restaurants
    search: (function ( mystate ) {
      var
      parseJson = function ( xhr ) {
        return JSON.parse(xhr.responseText);
      },
      path = '/api/restaurants';

      return function restarauntSearch ( search ) {
        if (mystate.req) { mystate.req.abort(); }

        var query = '?search='+search;

        mystate.req = ui.request(path+query)
          .header('Content-Type', 'application/json')
          .response(parseJson)
          .get(function ( error, results ) {
            if (!error) {
              api.render(results);
            } else {
              alert(' HTTP ERROR - Restaurants are broken :('); }
          });
      };
    }({ req: null })),

    render: (function ( mystate ) {
      return function renderRestaurant ( data ) {
        state.channels.RestaurantList.put(data);

        restaurants.style('display', 'block');

        if (!data || !data.length) {
          emptyView.style('display', 'block');
        } else {
          emptyView.style('display', 'none');
        }

        var
        rows = viewBody.selectAll('tr')
          .data(data),
        cells = rows.selectAll('td')
          .data(makeCellData),
        newRows = rows.enter().append('tr'),
        newRowCells = newRows.selectAll('td')
          .data(makeCellData);

        cells.enter()
          .append('td')
          .attr('class', function ( d, i ) {
            return mystate.cells.classes[i];
          })
          .style('color', function ( d, i ) {
            return mystate.cells.colors[i]; });

        newRowCells.enter()
          .append('td')
          .attr('class', function ( d, i ) {
            return mystate.cells.classes[i];
          })
          .style('color', function ( d, i ) {
            return mystate.cells.colors[i]; })
          .text(String);

        cells.text(identity);
        newRowCells.text(String);
        
        newRows.on('click', function ( d, i ) {
          console.log('r-clicked');
          console.log(d.name);
          if (d.locationpoint) {
            state.channels.ActiveRestaurant.put(d);
          }
        });
        
        rows.exit().remove();

        function makeCellData ( d, i, a ) {
          return [d.name,
                  d.location_1_location,
                  d.neighborhood,
                  'DEL'];
        }
      };
    }({
      cells: {
        colors: ['#caca86','#857575', '#8d6552', '#870000'],
        classes: ['r-name', 'r-address', 'r-hood', 'del-r']},
      marker: {
        icon: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png' }}))
  };

  // take from the search channel
  state.channels.Search.take(api.search);
  
  return api;
};
