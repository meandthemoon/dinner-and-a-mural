window.initMapView = (function ( state ) {  
  return function ( ) {
    var
    mural = {
      lng: -76.59300639936833, // coordinates[0] 
      lat: 39.303289014824315  // coordinates[1]
    },
    map = window.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: mural,
      styles: [// {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
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
    var marker = new google.maps.Marker({
      position: mural,
      map: map
    });
  };

}());

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
    label: ':::' }];



// var renderMurals = (function ( ) {
//   var 
//   muralsView = d3.select('.workspace')
//     .append('div')
//     .attr('class', 'mural-view'),

//   render = function ( selections ) {
//       selections.text(function ( d ) {
//         return d.artistfirstname + '  ' + d.artistlastname;
//       });
//   };

//   return function ( data ) {
//     var murals = muralsView
//         .selectAll('div.mural')
//         .data(data);

//     // Update
//     render(murals);

//     // Enter
//     var entering = murals.enter().append('div')
//         .attr('class', 'mural');

//     render(entering);

//     // Exit
//     murals.exit().remove();
//   };
  
// }());

d3.request('/api/murals')
  .header('Content-Type', 'application/json')
  .response(function ( xhr ) {
    return JSON.parse(xhr.responseText);
  })
  .get(function ( error, murals ) {
    if (!error) {
      renderMurals(murals);
    } else { alert('HTTP Error...'); }
  });


var table =d3
    .select('#app .murals')
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

var renderMurals = function ( data ) {
  var cells = muralRows
      .data(data)
      .enter()
      .append('tr')
      .selectAll('td')
      .data(function ( mural ) {
        return [mural.artistfirstname,
                mural.artistlastname,
                mural.year,
                mural.location,
                ''];
      })
      .enter()
      .append('td')
      .text(function ( d ) {
        return d;
      })
      .on('click', function ( d, i, a ) {
        console.log(this);
        console.log(arguments);
      });
};
