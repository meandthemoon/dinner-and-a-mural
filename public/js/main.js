print = console.log.bind(console);
identity = function ( I ) { return I; };

window.initMapView = (function ( state ) {
  return function ( ) {
    var
    center = {
      lng: -76.61111667463689, // coordinates[0]
      lat: 39.29040310219014  // coordinates[1]
    },
    map = window.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: center,
      styles: [
        // {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        // {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        // {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        // {featureType: 'administrative.locality',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#d59563'}]},
        // {featureType: 'poi',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#d59563'}]},
        // {featureType: 'poi.park',
        //  elementType: 'geometry',
        //  stylers: [{color: '#263c3f'}]},
        // {featureType: 'poi.park',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#6b9a76'}]},
        // {featureType: 'road',
        //  elementType: 'geometry',
        //  stylers: [{color: '#38414e'}]},
        // {featureType: 'road',
        //  elementType: 'geometry.stroke',
        //  stylers: [{color: '#212a37'}]},
        // {featureType: 'road',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#9ca5b3'}]},
        // {featureType: 'road.highway',
        //  elementType: 'geometry',
        //  stylers: [{color: '#746855'}]},
        // {featureType: 'road.highway',
        //  elementType: 'geometry.stroke',
        //  stylers: [{color: '#1f2835'}]},
        // {featureType: 'road.highway',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#f3d19c'}]},
        // {featureType: 'transit',
        //  elementType: 'geometry',
        //  stylers: [{color: '#2f3948'}]},
        // {featureType: 'transit.station',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#d59563'}]},
        // {featureType: 'water',
        //  elementType: 'geometry',
        //  stylers: [{color: '#17263c'}]},
        // {featureType: 'water',
        //  elementType: 'labels.text.fill',
        //  stylers: [{color: '#515c6d'}]},
        // {featureType: 'water',
        //  elementType: 'labels.text.stroke',
        //  stylers: [{color: '#17263c'}]}
      ]
    });

    // var marker = new google.maps.Marker({
    //   position: mural,
    //   map: map
    // });
  };
}());

window.daamRestaurants = (function ( state, ui ) {
  var
  restaurants = ui.select('#restaurants').append('div'),
  tableView = restaurants.append('table'),
  viewHeading = tableView.append('tbody'),
  viewBody = tableView.append('tbody');

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
              alert(' HTTP ERROR Restaruants are broken :('); }
          });
      };
    }({})),

    render: function ( tbody, data ) {
      if (!data || !data.length) {  return ; }

      // Bind
      var rows = tbody.selectAll('tr').data(data);
      // Enter
      rows.enter().append('tr');
      // Update
      rows
        .selectAll('td span')
        .text(function ( d, i, a ) {
          return d;
        });

      // Bind
      var cells = rows.selectAll('td')
          .data(function ( d, i, a ) {
            print('cell');
            print(d);
            return ['Z',
                    '_',
                    d.name,
                    d.location_1_location,
                    d.neighborhood];
          });

      // Enter
      cells.enter().append('td');
      // Update
      cells
        .text(identity)
        .attr('class', function ( d, i ) {
          return state.cells.classes[i]; })
        .style('color', function ( d, i ) {
          console.log(arguments);
          return state.cells.colors[i]; });

      rows.on('click', function ( d, i, a ) {
        print(data[i].name);
        print(data[i].location_1_location);
        print(data[i].neighborhood);
      });

      // Exit
      cells.exit().remove();
      rows.exit().remove();
    }
  };
}({cells: { colors:  ['#596f50', '#596f50', '#caca86', '#857575', '#8d6552'],
            classes: ['hover-color-grey',
                      'hover-color-grey',
                      '',
                      'hover-color-grey',
                      'hover-color-grey']}},
  d3));

// initialize and assign global api
window.daam = (function ( state, ui ) {
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

  var search = ui.select('#search')
      .on('input', function ( ) {
        if (this.value.length > 2) {
          daamRestaurants.search(this.value); }
      });

})({}, d3);

function renderAll ( owner, selector, element, data ) {
  var
  selected = owner.selectAll(selector),
  appended = selected.enter().append(element);

  appended.exit().remove();
  appended.data(data);
}

function renderTable ( owner, table, cb, data ) {
  renderAll(ownder, d3.select(), 'tr', data);
}

var muralColumns = [
  { dataField: 'artistfirstname',
    label: 'Artist FirstName' },
  { dataField: 'artistlastname',
    label: 'Artist Last Name' },
  { dataField: 'year',
    label: 'Year Completed' },
  { dataField: 'location',
    label: 'Location' },
  { dataField: 'actions',
    label: '✓' }];

// d3.request('/api/murals')
//   .header('Content-Type', 'application/json')
//   .response(function ( xhr ) {
//     return JSON.parse(xhr.responseText);
//   })
//   .get(function ( error, murals ) {
//     if (!error) {
//       renderMurals(murals);
//     } else { alert('HTTP Error...'); }
//   });




var renderMurals = function ( data ) {
var table =d3
    .selectAll('#app .murals')
    .append('table');

var muralHeadings = table
    .append('thead')
    .append('tr')
    .selectAll('th')
    .data(muralColumns)
    .enter().append('th')
    // .style('color', '#eeaa66')
    .text(function ( d ) {
      return d.label;
    });

var muralRows = table
    .append('tbody')
    .selectAll('tr');

  var rows = muralRows
      .data(data)
      .enter()
      .append('tr')
      .on('click', function ( d, i, a ) {
        d.selected = true;
        print(this);
        print(arguments);
      });

  var cells = rows.selectAll('td')
      .data(function ( mural ) {
        return [mural.artistfirstname,
                mural.artistlastname,
                mural.year,
                mural.location,
                ''];
      })
      .enter()
      .append('td')
      .text(String);
};
