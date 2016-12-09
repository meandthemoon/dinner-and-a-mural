window.daamDataTable = (function ( ui ) {

  return function ( config ) {
    var
    owner = config.owner,
    thead = owner.append('thead'),
    tbody = owner.append('tbody'),
    options = config.tableOptions || {},
    colOptions =   options.column || {},
    rowOptions =      options.row || {};

    var api = {
      render: (function ( mystate ) {
        return function renderRestaurant ( data ) {

          if (!data || !data.length) {
            return owner.style('display', 'none');
          } else { owner.style('display', 'table'); }

          var
          rows = tbody.selectAll('tr')
            .data(data),
          cells = rows.selectAll('td')
            .data(makeCellData);

          var
          newRows = rows.enter()
            .append('tr')
            .attr('class', rowOptions.class || ''),
          newRowCells = newRows.selectAll('td')
            .data(makeCellData);

          cells.enter()
            .append('td')
            .attr('class', function ( d, i ) {
              return colOptions[i].class;
            });

          newRowCells.enter()
            .append('td')
            .attr('class', function ( d, i ) {
              return colOptions[i].class;
            })
            .text(String);

          cells.text(String);
          newRowCells.text(String);

          if (rowOptions.click) {
            newRows.on('click', rowOptions.click); }

          rows.exit().remove();

          if (mystate.rendered) { return; }
          mystate.rendered = true;

          var heading = thead.append('tr');
          heading.selectAll('td')
            .data(colOptions)
            .enter()
            .append('td')
            // Sorting based on columnar labels (fwd/bwd)
            .on('click', function ( d, i ) {
              var
              key = colOptions[i].dataKey,
              dir = mystate.sortDirection =
                mystate.sortDirection ? 0 : 1;

              api.render(data.sort(function ( a, b ) {
                var
                aVal = getKeyVal(key, a),
                bVal = getKeyVal(key, b),
                comp = ((aVal ? aVal.toString().toUpperCase() : '') <
                        (bVal ? bVal.toString().toUpperCase() : ''));

                return dir ? (comp ? 1 : -1) : (comp ? -1 : 1);
              }));
            })
            .text(function ( _, i ) {
              return colOptions[i].heading;
            });

          function makeCellData ( d, i, a ) {
            return colOptions.map(function ( option ) {
              return getKeyVal(option.dataKey, d);
            });
          }
        };
      }({ rendered: false,
          sortDirection: 1 }))
    };

    return api;

    // returns a string
    function getKeyVal ( key, obj ) {
      if (typeof key == 'function') {
        return key(obj);
      } else { return obj[key]; }
    }

  };

}(d3));
