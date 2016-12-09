var daamMurals = function ( ui, state ) {

  var // UI
  murals = ui.select('#murals'),
  listsContainer = murals.append('div')
    .attr('class', 'list-views'),
  emptyView = listsContainer.append('div')
    .style('display', 'none')
    .attr('class', 'nothing-found')
    .text('... no results');

  var
  artworks = null,
  settings = {};

  var listViewTable = daamDataTable({
    owner: listsContainer.append('table').attr('class', 'atd'),
    tableOptions: {
      row: { /* */ },
      column: [{ heading: 'Artwork Title',
                 dataKey: getTitle,
                 class:   'a-title' },
               { heading: 'Address',
                 dataKey: 'addressofartwork',
                 class:   'a-address' },
               { heading: 'Artist(s)',
                 dataKey: getCredits,
                 class:   'a-credits' }]
    }
  });

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

    render: listViewTable.render

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
