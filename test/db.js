var should = require('should');

var 
config = require('../config'),
db = require('../db')(config.persistence);

describe('ORM configuration', function ( ) {
  var models;

  before(function ( next ) {
    // db connect
    db.then(function ( db ) {
      models = db.models;
      next();
    }).catch(function ( error ) { throw error; });
  });

  describe(
    'Restaurants: Create | Read | Update | Delete',
    function ( ) {
      var
      inserted,
      restaurants = require('./test-data').restaurants;

      it('Create | Read', function ( next ) {
        // Create
        models.Restaurant.bulkCreate(restaurants)
          .then(function ( ) {
            // Read
            return models.Restaurant.findAll({
              attributes: null,
              where: { neighborhood: 'Fantasy Hood',
                       councildistrict: 'Fantasy District' }
            });
          })
          .then(function ( records ) {
            inserted = records;
            // should(inserted).have.property('length', 2);
            should(inserted.filter(function ( r ) {
              return r.name === 'Fantasy Eatery';
            })).have.property('length', 1);
            should(inserted.filter(function ( r ) {
              return r.name === 'Fantasy Cafe';
            })).have.property('length', 1);
            next();
          })
          .catch(function ( error ) {
            throw error;
          });
      });

      it('Update | Read', function ( next ) {
        models.Restaurant.update({
          name: 'Fantasy Cafeteria'
        }, {
          where: { name: 'Fantasy Cafe' }
        }).then(function ( rows ) {
          should(rows.length).equal(1);
          next();
        });
      });

      it('Delete | Read', function ( next ) {
        models.Restaurant.destroy({
          where: { neighborhood: 'Fantasy Hood',
                   councildistrict: 'Fantasy District' }
        }).then(function ( ) {
          return models.Restaurant.findAll({
            attributes: null,
            where: { neighborhood: 'Fantasy Hood',
                     councildistrict: 'Fantasy District' }
          });
        }).then(function ( records ) {
          should(records.length).equal(0);
          next();
        });
      });
      
    });

  describe(
    'Public Artwork: Create | Read | Update | Delete',
    function ( ) {
      var
      inserted,
      artworks = require('./test-data').artworks;
      
      it('Create | Read', function ( next ) {
        // Create
        models.PublicArt.bulkCreate(artworks)
          .then(function ( ) {
            // Read
            return models.PublicArt.findAll({
              attributes: null,
              where: { location_location: 'Fantasy City' }
            });
          })
          .then(function ( records ) {
            inserted = records;
            should(inserted).have.property('length', 2);
            should(inserted.filter(function ( r ) {
              return r.titleofartwork === 'Fantasy Piece #1';
            })).have.property('length', 1);
            should(inserted.filter(function ( r ) {
              return r.titleofartwork === 'Fantasy Piece #2';
            })).have.property('length', 1);
            next();
          })
          .catch(function ( error ) {
            throw error;
          });
      });

      it('Update | Read', function ( next ) {
        models.PublicArt.update({
          artistfirstname: 'Fantasy Man-o'
        }, { where: {
          artistfirstname: 'Fantasy Man'
        }})
          .then(function ( rows ) {
            should(rows.length).equal(1);
            next();
          });
      });

      it('Delete | Read', function ( next ) {
        models.PublicArt.destroy({
          where: { artistfirstname: 'Fantasy Man-o' }
        })
          .then(function ( ) {
            return models.PublicArt.findAll({
              attributes: null,
              where: { artistfirstname: 'Fantasy Man-o' }
            });
          })
          .then(function ( records ) {
            should(records.length).equal(0);
            next();
          });
      });
      
    });
  
});
