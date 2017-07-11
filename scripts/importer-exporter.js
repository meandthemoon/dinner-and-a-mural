var
async = require('async'),
fs = require('fs'),
r = require('ramda'),
request = require('request');

var addGeoLookup = require('../datasets/address-locations');

(function main ( config, dbConnect, sources ) {

  // minimal amount of data normalizing
  var transformations = {
    Mural: function ( data ) {
      return r.map(function ( d ) {
        return r.assoc('locationpoint', d.location_1, d);
      }, data);
    },
    Restaurant: function ( data ) {
      return r.map(function ( d ) {
        var
        key = d.location_1_location +
          '+Baltimore+MD+' +
          r.compose(r.join('+'),
                    r.split(/\s/))(d.neighborhood),

        // Value may be in different paths within
        // the dataset, depending on Google's
        // address-to-geolocation web API response:
        location = (r.path([key, 'geometry', 'location'],
                           addGeoLookup) ||
                    r.compose(
                      r.ifElse(r.isNil, r.identity,
                               r.path(['geometry', 'location'])),
                      r.head,
                      r.propOr([], 'results'),
                      r.prop(key))(addGeoLookup));

        return (location ?
                r.assoc('locationpoint',
                        { type: 'Point',
                          coordinates: [location.lng, location.lat ] },
                        d)
                : d);
      }, data);
    },
    PublicArt: function ( data ) {
      return r.map(function ( d ) {
        var
        primaryZip = /\d{5}/.exec(d.zipcodes || ''),
        title = (!d.titleofartwork ||
                 d.titleofartwork === 'Unknown') ? null : d.titleofartwork;
        return r.compose(
          r.assoc('titleofartwork', title),
          r.assoc('locationpoint', d.location),
          r.assoc('zipcode', primaryZip))(d);
      }, data);
    }
  };

  var
  flag = process.argv[2],
  handlers = {
    // queury open baltimore apis and save to local disk
    '-i': function ( ) {
      // sources.forEach(function ( source ) {
      //   var
      //   token = config.open_baltimore['X-App-Token'],
      //   dataReq = request({
      //     headers: { 'X-App-Token': token,
      //                'Accept': 'application/json' },
      //     method: 'GET',
      //     url: source.url+'?$limit=1500'
      //   }).pipe(require('fs').createWriteStream(source.saveTo));
        
      //   console.log(' - Fetching fresh', source.name, 'data');
      // });
			console.log(' - Skipping export step and using included project data.');
    },

    // export local files ( existing or updated from import ) to database
    '-e': function ( ) {
      var
      connection,
      save = function ( source, next ) {
        var
        transform = transformations[source.name] ?
          transformations[source.name] :
          r.identity;
          
        data = require('../'+source.saveTo);
        connection.models[source.name]
          .bulkCreate(transform(data))
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
        .catch(function ( error ) {
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
