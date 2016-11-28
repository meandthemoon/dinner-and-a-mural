var schema = module.exports = (function ( Database ) {
  return [{
    modelName: 'Restaurant',
    schema: {
      councildistrict: { type: Database.STRING(100) },
      location_1_city: { type: Database.STRING(100) },
      location_1_location: { type: Database.STRING(100) },
      location_1_state: { type: Database.STRING(8) }, // 'MD', 'Maryland'
      name: { type: Database.STRING(100) },
      neighborhood: { type: Database.STRING(50) },
      policedistrict: {type: Database.STRING(50) },
      zipcode: { type: Database.STRING (10) }} // 
  }, {
    modelName: 'Mural',
    schema: {
      artistfirstname: { type: Database.STRING(50) },
      artistlastname: { type: Database.STRING(50) },
      location: { type: Database.STRING(100) }, // address_1,
      location_1: { type: Database.GEOMETRY('POINT') },
      location_1_location: { type: Database.STRING(100) },
      location_1_zip: { type: Database.STRING(10) }, 
      year: { type: Database.STRING(4) }}
  }];
}(require('sequelize')));
