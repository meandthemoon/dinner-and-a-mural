window.daamRestaurants = (function ( ui, state ) {

  var
  restaurants = ui.select('#restaurants'),
  tableView = restaurants.append('div').append('table'),
  thead = tableView.append('thead')
    .append('tr')
    .selectAll('td')
    .data(['name', 'address', 'neighborhood'])
    .enter().append('td').text(String),
  emptyView = restaurants.append('div')
    .style('display', 'none')
    .attr('class', 'nothing-found')
    .text('... no results'),
  viewBody = tableView.append('tbody');

  // API
  return {
    // search for restaurants
    search: (function ( mystate ) {
      var
      parseJson = function ( xhr ) {
        return JSON.parse(xhr.responseText);
      },
      path = '/api/restaurants';

      return function ( search ) {
        if (mystate.req) { mystate.req.abort(); }
        var query = '?search='+search;

        // state.channels.Search(search);

        mystate.req = ui.request(path+query)
          .header('Content-Type', 'application/json')
          .response(parseJson)
          .get(function ( error, results ) {
            if (!error) {
              daamRestaurants.render(results);
            } else {
              alert(' HTTP ERROR Restaurants are broken :('); }
          });
      };
    }({ req: null })),

    render: (function ( mystate ) {
      return function ( data ) {
        // state.channels.restaurantsChange(data);

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
          daamMurals.search(d.zipcode);
          if (d.locationpoint) {
            new (google.maps.Marker)({
              position: {
                lng: d.locationpoint.coordinates[0],
                lat: d.locationpoint.coordinates[1]
              },
              icon: mystate.marker.icon,
              map: map
            });
          }
        });
        rows.on('click', function ( d, i ) {
          daamMurals.search(d.zipcode);
          if (d.locationpoint) {
            new (google.maps.Marker)({
              position: {
                lng: d.locationpoint.coordinates[0],
                lat: d.locationpoint.coordinates[1]
              },
              icon: mystate.marker.icon,
              map: map
            });
          }
        });

        rows.selectAll('.map-r')
          .on('click', function ( d, i, a ) {
            // console.log('cell data: ', d);
            // console.log('');
            // console.log('parent data:');
            // console.log(ui.select(this.parentNode).datum());
          });

        rows.exit().remove();

        function makeCellData ( d, i, a ) {
          return [d.name,
                  d.location_1_location,
                  d.neighborhood,
                  'DEL'];
        }
      };
    }({ cells: { colors: ['#caca86',
                          '#857575',
                          '#8d6552',
                          '#870000'],
                 classes: ['r-name',
                           '',
                           '',
                           'del-r']},
        marker: { icon: 'http://labs.google.com/ridefinder/images/mm_20_yellow.png' }}))
  };

}(d3, {}));
