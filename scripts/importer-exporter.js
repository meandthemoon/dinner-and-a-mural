var
fs = require('fs'),
request = require('request');

(function main ( config, database, sources ) {
  var
  flag = process.argv[2],
  handlers = {
    // queury open baltimore apis and save to local disk
    '-i': function ( ) {
      sources.forEach(function ( source ) {
        var
        token = config.open_baltimore['X-App-Token'],
        dataReq = request({
          headers: {
            'X-App-Token': token,
            'Accept': 'application/json' },
          method: 'GET',
          url: source.url+'?$limit=1500'
        }).pipe(require('fs').createWriteStream(source.saveTo));
      });
    },

    // export local files ( existing or updated from import ) to database
    '-e': function ( ) {
      var connection;
      database(config.persistence)
        .then(function ( conn ) {
          connection = conn;
          console.log(connection);
          console.log(conn);
          // sources.forEach(function ( source ) {
          var data = require('../'+sources[0].saveTo);
          return connection.models[sources[0].name].bulkCreate(data);
          // });
        })
        .then(function ( ) {
          var data = require('../'+sources[1].saveTo);
          return connection.models[sources[1].name].bulkCreate(data);
          // sources.forEach(function ( source ) {
            // connection.models[source.name].findOne({})
            //   .then(function ( ) { console.log('inserted...');
            //                        console.log(arguments[0]);});
          // });
        })
        .then(function ( ) {
          return connection.models[sources[0].name].findOne({})
            .then(function ( ) { console.log('inserted...');
                                 console.log(arguments[0]);});
        })
        .then(setTimeout(process.exit.bind(process), 1000))
        .catch(function ( error ) {
          console.error('UNABLE TO EXPORT:\n', error, error.stack);
        });
    },

    '--help': function ( ) {
      console.log([
        '--------------------------------------------------------------',
        '.  Import/Export Help                                        .',
        '--------------------------------------------------------------',
        '.  Use the following flags:                                  .',
        '.  -i : import datasets from OpenBaltimore API to disk       .',
        '.  -e : export datasets from disk to database                .',
        '.     : this menu will display otherwise                     .',
        '--------------------------------------------------------------'
      ].join('\n'));
    }
  };

  return handlers[flag in handlers ? flag : '--help']();

}(require('../config'),
  require('../db'),
  [{ name: 'Mural',
     url: 'https://data.baltimorecity.gov/resource/x3eq-9sua.json',
     saveTo: 'datasets/murals.json',
     location: 'datasets/murals.json' },

   { name: 'Restaurant',
     url: 'https://data.baltimorecity.gov/resource/abuv-d2r2.json',
     saveTo: 'datasets/restaurants.json',
     location: 'datasets/restaurants.json' }]));
