var
fs = require('fs'),
request = require('request');

(function main ( sources ) {
  var
  action = process.argv[2],
  actionHandlers = {
    '-i': function ( ) {
      sources.forEach(function ( source ) {
        var dataReq = request({
          headers: {
            'X-App-Token': 'fFMCeyO16TyLUVSpGu2Kaz77J',
            'Accept': 'application/json' },
          method: 'GET',
          url: source.url+'?$limit=1500'
        }).pipe(require('fs').createWriteStream(source.saveTo));
      });
    },

    '-e': function ( ) {
      
    },

    'info': function ( ) {
      console.log([
        '------------------------------------------------------------',
        '  Help Menu',
        '------------------------------------------------------------',
        '  Use the following flags:',
        '  -i : import datasets from OpenBaltimore API to disk',
        '  -e : export datasets from disk to database',
        '     : this menu will display otherwise',
        '------------------------------------------------------------'
      ].join('\n'));
    }
  };

  return actionHandlers[action in actionHandlers ? action : 'info']();

}([{ name: 'Murals',
     url: 'https://data.baltimorecity.gov/resource/x3eq-9sua.json',
     saveTo: 'datasets/murals.json' },

   { name: 'Restaurants',
     url: 'https://data.baltimorecity.gov/resource/abuv-d2r2.json',
     saveTo: 'datasets/restaurants.json' }]));
