var exit = process.exit.bind(process);

var config = require('../config');
var googleClient = require('../lib/google-client')(config.google);

var restaurants = require('../datasets/restaurants');
var addresses = restaurants.map(function ( address ) {
  return address.location_1_location + ' Baltimore MD';
});

googleClient.geocodeAddresses(
  addresses,
  function ( error, dict ) {
    if (error) { throw error; }

    require('fs').writeFileSync('../datasets/address-locations.json',
                                JSON.stringify(dict));
    setTimeout(exit, 1000);
  });
