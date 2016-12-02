window.daamRestaurants = (function ( ui, state ) {
  var
  restaurants = ui.select('#restaurants')
    .style('display', 'none'),
  tableView = restaurants.append('div').append('table'),
  emptyView = ui.select('#restaurants').append('div')
    .style('display', 'none')
    .attr('class', 'nothing-found')
    .text('... no results'),
  viewBody = tableView.append('tbody');

  // API
  return {
    // search for restaurants
    search: (function ( state ) {
      var
      parseJson = function ( xhr ) {
        return JSON.parse(xhr.responseText);
      },
      path = '/api/restaurants';

      return function ( search ) {
        if (state.req) { state.req.abort(); }

        var query = '?search='+search;
        state.req = ui.request(path+query)
          .header('Content-Type', 'application/json')
          .response(parseJson)
          .get(function ( error, results ) {
            if (!error) {
              daamRestaurants.render(viewBody, results);
            } else {
              alert(' HTTP ERROR Restaurants are broken :('); }
          });
      };
    }({})),

    render: function ( tbody, data ) {
      restaurants.style('display', 'block'); 

      if (!data || !data.length) {
        emptyView.style('display', 'block');
        // restaurants.style('display', 'none');
      } else {
        emptyView.style('display', 'none');
        }

      // Bind
      var rows = tbody.selectAll('tr').data(data);
      var cells = rows.selectAll('td')
          .data(makeCellData);
      var newRowCells = rows.enter()
          .append('tr')
          .selectAll('td')
          .data(makeCellData);

      cells.enter().append('td')
        .style('color', function ( d, i ) {
          return state.cells.colors[i]; });

      newRowCells.enter()
        .append('td')
        .style('color', function ( d, i ) {
          return state.cells.colors[i]; })
        .text(String);

      cells.text(identity);
      newRowCells.text(String);


      rows.on('click', function ( d, i ) {
        console.log(d);
        console.log(this);
      });

      rows.exit().remove();

      function makeCellData ( d, i, a ) {
        return ['MAP',
                '#Z#',
                d.name,
                d.location_1_location,
                d.neighborhood,
               'DEL'];
      }
    }
  };
}(d3,
  { cells: { colors:  ['#596f50', '#596f50', '#caca86', '#857575', '#8d6552', '#870000'],
             classes: ['hover-color-grey',
                       'hover-color-grey',
                       '',
                       'hover-color-grey',
                       'hover-color-grey']}}));
