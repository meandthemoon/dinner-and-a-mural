var
r = require('ramda'),
request = require('request');

var client = module.exports = function ( config ) {
  var
  city = 'Baltimore',
  state = 'MD',
  cityAndState = city+'+'+state,
  serviceUrl = config.geocode_service_url,
  geocodeUrl = serviceUrl + '?address=',
  // fns
  getGeocodingUrl = r.concat(geocodeUrl),
  formatAddress = r.compose(r.concat(r.__, cityAndState),
                            r.concat(r.__, '+'),
                            r.join('+'),
                            r.split(/\s+/));

  // string => location
  client.geocodeAddress = function ( address, next ) {
    if (!address) { return next();  }
    var url = r.compose(getGeocodingUrl, formatAddress)(address);

    request.get(
      { url: url, json: true },
      function ( error, response, body ) {
        if (!error && r.prop(['results'], body || {})) {
          return next(null, r.head(body.results || [])); }

        return next(error);
      });
  };

  // [string] => [{address:location}]
  client.geocodeAddresses = function ( addresses, next ) {
    async.mapLimit(
      addresses,
      20,
      function ( address, next ) {
        client.geocodeAddress(address, function ( error, data ) {
          return next(0, [address, data]);
        });
      }, function ( _, results ) {
        if (results) {
          return next(0, r.reduce(function ( memo, pair ) {
            return r.assoc(pair[0], pair[1], memo);
          }));
        }
        return next(0, results);
      });
  };

  return client;
};

