var should = require('should');

var 
config = require('../config'),
db = require('../db')(config.persistence);

describe('ORM configuration', function ( ) {
  var
  DataSources,
  inserted;

  // before(function ( next ) {
  //   // db connect
  //   db.sync().then(function ( db ) {
  //     DataSources = db.models.DataSources;
  //     next();
  //   }).catch(function ( error ) { throw error; });
  // });

  describe('Create | Read | Update | Delete', function ( ) {

    // before(function ( next ) {
    // });
    
    it('Create & Read', function ( ) {
      // Create
      // DataSources.bulkCreate(testData)
      //   .then(function ( ) {
      //     return DataSources.findAll({
      //       attributes: ['website', 'link'],
      //       where: { 'link': '#test' }
      //     });
      //   })
      //   .then(function ( records ) {
      //     should(records).have.property('length', 3);
      //     // console.log(records.map(function ( r ) {
      //     //   console.log(r.dataValues);
      //     // }));
      //     next();
      //   })
      //   .catch(function ( error ) {
      //     throw error;
      //   });
    });

    it('Update and Read', function ( ) {});

    it('Delete and Read', function ( ) {});
    
  });
  
});
