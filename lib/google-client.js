var
async = require('async'),
r = require('ramda'),
request = require('request');

var client = module.exports = function ( config ) {
  var
  city = 'Baltimore',
  state = 'MD',
  cityAndState = city+'+'+state,
  serviceUrl = config.geocode_service_url,
  geocodeUrl = serviceUrl +
    '?key=' + config.key +
    '&address=',
  // fns
  getGeocodingUrl = r.concat(geocodeUrl),
  formatAddress = r.compose(r.concat(r.__, cityAndState),
                            r.concat(r.__, '+'),
                            r.join('+'),
                            r.split(/\s+/));

  // String => Geometry Type
  client.geocodeAddress = function ( address, next ) {
    if (!address) { return next();  }
    var url = r.compose(getGeocodingUrl,
                        formatAddress)(address);

    request.get(
      { url: url, json: true },
      function ( error, response, body ) {
        if (!error && r.prop(['results'], body || {})) {
          if (r.prop('error_message', body || {})) {
            console.log(r.prop('error_message', body));
          }

          var extractData = r.compose(
            r.ifElse(r.isNil,
                     r.identity,
                     r.prop('geometry')),
            r.head);
          
          return next(null, extractData(body.results || []));
        }
        return next(error);
      });
  };

  // [string] => [{address:location}]
  client.geocodeAddresses = function ( addresses, next ) {
    async.mapLimit(
      addresses,
      30,
      function ( address, next ) {
        client.geocodeAddress(address, function ( error, data ) {
          // if (error) { console.log(error); }
          // if (!data) { console.log(address); }

          return next(0, [address, data]);
        });
      }, function ( _, results ) {
        if (results) {
          return next(0, r.reduce(function ( memo, pair ) {
            return r.assoc(pair[0], pair[1], memo);
          }, {}, results));
        }
        return next(0, results);
      });
  };

  return client;
};

