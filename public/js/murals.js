var daamMurals = function ( ui, state ) {
  var // UI
  murals = ui.select('#murals'),
  tableView = murals.append('div').append('table'),
  thead = tableView.append('thead')
    .append('tr')
    .selectAll('td')
    .data(['Artwork Title', 'Address', 'Artist(s)'])
    .enter().append('td').text(String),
  
  emptyView = murals.append('div')
    .style('display', 'none')
    .attr('class', 'nothing-found')
    .text('... no results'),
  viewBody = tableView.append('tbody');

  var
  artworks = null,
  settings = {};

  var api = {
    search: (function ( mystate ) {
      var
      parseJson = function ( xhr ) {
        return JSON.parse(xhr.responseText);
      },
      path = '/api/murals';

      return function ( search ) {
        if (mystate.req) { mystate.req.abort(); }
        var query = '?zip='+search;
        mystate.req = ui.request(path)
          .header('Content-Type', 'application/json')
          .response(parseJson)
          .get(function ( error, results ) {
            if (!error) {
              artworks = results;
            } else {
              alert(' HTTP ERROR - Murals are broken :('); }
          });
      };
    }({})),

    loadArtworks: (function ( ) {
      var
      parseJson = function ( xhr ) {
        return JSON.parse(xhr.responseText);
      },
      path = '/api/murals';
      return function ( search ) {
        ui.request(path)
          .header('Content-Type', 'application/json')
          .response(parseJson)
          .get(function ( error, results ) {
            if (!error) {
              artworks = results;
            } else {
              alert(' HTTP ERROR Murals are broken :('); }
          });
      };
    }()),

    render: (function ( mystate ) {
      return function ( data ) {
        if (!data) {        // hide
          murals.style('display', 'none');
          return;
        }
        if (!data.length) { // display "no results..."
          emptyView.style('display', 'block');
          return;
        } else {            // display results
          murals.style('display', 'block');
          emptyView.style('display', 'none'); }

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
            return mystate.cells.classes[i]; });

        newRowCells.enter()
          .append('td')
          .attr('class', function ( d, i ) {
            return mystate.cells.classes[i]; })
          .text(String);

        cells.text(identity);
        newRowCells.text(String);

        rows.on('click', function ( d, i ) { });

        rows.exit().remove();
        
        function makeCellData ( d, i, a ) {
          return [getTitle(d), d.addressofartwork, getCredits(d)];
        }
        
        function getPinTitle ( d ) {
          if (!d.titleofartwork ||
              /unknown/i.test(d.titleofartwork)) {
            return ((d.artistfirstname || 'Mr./Miss.') +
                    ' ' +
                    (d.artistlastname  || 'Unknown'));
          } else { return d.titleofartwork; }
        }

        function getTitle ( d ) {
          if (!d.titleofartwork ||
              /unknown/i.test(d.titleofartwork)) {
            return '-no title-';
          }
          return '"' + d.titleofartwork + '"';
        }

        function getCredits ( d ) {
          return 'By ' + ((d.artistfirstname || 'Mr./Miss.') +
                          ' ' +
                          (d.artistlastname  || 'Unknown'));
        }

      };
    }({ cells: { classes: ['a-title', 'a-address', 'a-credits'] },
        marker: { icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png' }}))
  };

  api.loadArtworks();

  state.channels.ActiveRestaurant.take(function muralSearch ( r ) {
    var artworkList = artworks.filter(function ( a ) {
      // NICE-TO-HAVE
      // Base this filter on settings:
      //  w/in walking radius etc
      return r.zipcode === a.zipcode;
    });
    
    api.render(artworkList);
    state.channels.ArtworkList.put(artworkList);
  });

  return api;
};
