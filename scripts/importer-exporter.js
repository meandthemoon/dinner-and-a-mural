var
async = require('async'),
fs = require('fs'),
request = require('request');

(function main ( config, dbConnect, sources ) {
  var
  flag = process.argv[2],
  handlers = {
    // queury open baltimore apis and save to local disk
    '-i': function ( ) {
      sources.forEach(function ( source ) {
        var
        token = config.open_baltimore['X-App-Token'],
        dataReq = request({
          headers: { 'X-App-Token': token,
                     'Accept': 'application/json' },
          method: 'GET',
          url: source.url+'?$limit=1500'
        }).pipe(require('fs').createWriteStream(source.saveTo));
        
        console.log(' - Fetching fresh', source.name, 'data');
      });
    },

    // export local files ( existing or updated from import ) to database
    '-e': function ( ) {
      var
      connection,
      save = function ( source, next ) {
        var data = require('../'+source.saveTo);
        connection.models[source.name]
          .bulkCreate(data)
          .then(function ( ) {
            console.log(' -', source.name, 'data saved to database');
          })
          .then(next);
      };

      dbConnect(config.persistence)
        .then(function ( ) { connection = arguments[0]; })
        .then(function ( ) {
          async.eachSeries(
            sources,
            save,
            function sourcesExported ( error ) {
              if (error) {
                console.log(error.toString());
                throw error; }
              setTimeout(process.exit.bind(process), 1000);
            });
        })
        // .then(function ( conn ) {
        //   connection = conn;
        //   var data = require('../'+sources[0].saveTo);
        //   return connection.models[sources[0].name].bulkCreate(data);
        // })
        // .then(function ( ) {
        //   var data = require('../'+sources[1].saveTo);
        //   return connection.models[sources[1].name].bulkCreate(data);
        // })
        // .then(function ( ) {
        //   return connection.models[sources[0].name].findOne({})
        //     .then(function ( ) { console.log('inserted...');
        //                          console.log(arguments[0]);});
        // })
        .catch(function ( error ) {
          console.log('in catch');
          throw error;
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
  [{ name:     'Mural',
     url:      'https://data.baltimorecity.gov/resource/x3eq-9sua.json',
     saveTo:   'datasets/murals.json',
     location: 'datasets/murals.json' },

   { name:     'Restaurant',
     url:      'https://data.baltimorecity.gov/resource/abuv-d2r2.json',
     saveTo:   'datasets/restaurants.json',
     location: 'datasets/restaurants.json' },

   { name:     'PublicArt',
     url:      'https://data.baltimorecity.gov/resource/fbq3-gj79.json',
     saveTo:   'datasets/publicArt.json',
     location: 'datasets/publicArt.json' }]));
