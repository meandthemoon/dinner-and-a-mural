var schema = module.exports = (function ( Database ) {
  return [
    { modelName: 'Restaurant',
      schema: { councildistrict: { type: Database.STRING(100) },
                location_1: { type: Database.GEOMETRY('POINT') },
                location_1_city: { type: Database.STRING(100) },
                location_1_location: { type: Database.STRING(100) },
                location_1_state: { type: Database.STRING(8) },
                locationpoint: { type: Database.GEOMETRY('POINT') },
                name: { type: Database.STRING(100) },
                neighborhood: { type: Database.STRING(50) },
                policedistrict: {type: Database.STRING(50) },
                zipcode: { type: Database.STRING (10) }}},

    { modelName: 'Mural',
      schema: { artistfirstname: { type: Database.STRING(50) },
                artistlastname: { type: Database.STRING(50) },
                location: { type: Database.STRING(100) },
                location_1: { type: Database.GEOMETRY('POINT') },
                location_1_location: { type: Database.STRING(100) },
                location_1_zip: { type: Database.STRING(10) },
                locationpoint: { type: Database.GEOMETRY('POINT') },
                year: { type: Database.STRING(10) }}},

    { modelName: 'PublicArt',
      schema: { addressofartwork: { type: Database.STRING(250) },
                artistfirstname:  { type: Database.STRING(50) },
                artistlastname: { type: Database.STRING(50) },
                dateofartwork: { type: Database.STRING(50) },
                titleofartwork: {type: Database.STRING(250) },
                location: { type: Database.GEOMETRY('POINT'), },
                location_location: { type: Database.STRING(200) },
                locationofartwork: { type: Database.STRING(200) },
                locationpoint: { type: Database.GEOMETRY('POINT') },
                medium: { type: Database.STRING(50) },
                zipcode: { type: Database.STRING(50) },
                zipcodes: { type: Database.STRING(50) }}}
  ];
}(require('sequelize')));
