var r = require('ramda');

// : factory
// : dependent on data models and router to which
// to register handlers
var api = module.exports = function ( models, router ) {
  var
  getModel = r.prop(r.__, models),
  muralQuery = r.partial(r.__, [getModel('PublicArt')]),
  restaurantQuery = r.partial(r.__, [getModel('Restaurant')]);

  api.handlers = r.compose(
    r.assoc('getMurals',
            muralQuery(function ( Model, projections, filter ) {
              var options = r.compose(
                r.ifElse(r.always(projections),
                         r.assoc('attributes', projections),
                         r.identity),
                r.ifElse(r.always(filter),
                         r.assoc('where', filter),
                         r.identity)
              )({});
              return Model.findAll(options);
            })),

    r.assoc('getRestaurants',
            restaurantQuery(function ( Model, projections, filter ) {
              var options = r.compose(
                r.ifElse(r.always(projections),
                         r.assoc('attributes', projections),
                         r.identity),
                r.ifElse(r.always(filter),
                         r.assoc('where', filter),
                         r.identity)
              )({});
              return Model.findAll(options);
            }))

  )({});

  // 
  router.get('/murals', function ( req, res, _ ) {
    api.handlers
      .getMurals(['id',
                  'addressofartwork',
                  'artistfirstname',
                  'artistlastname',
                  'titleofartwork',
                  'locationpoint',
                  'zipcode'],
                 null)
      .then(function ( results ) {
        res.json(results);
      })
      .catch(function ( error ) {
        console.log(error);
        return res
          .status(500)
          .send({ message: 'ERROR',
                  error: error,
                  stack: error.stack });

      });
  });

  // given a search term, returns a collection of restaurants
  //  whose names, street, or neighborhood match
  router.get('/restaurants/search/:search_string', function ( req, res, _ ) {
    var search_string = req.params.search_string;
    if (!search_string) {
      return res.status(400).send({ message: 'send search param' }); }

    api.handlers
      .getRestaurants(
        // REFACTOR
        // Limit attributes
        null, // select *
        { $or: [
          {location_1_location: { $like:'%'+search_string+'%' }},
          {name:                { $like:'%'+search_string+'%' }},
          {neighborhood:        { $like:'%'+search_string+'%' }} ]})

      .then(function ( results ) {
        return res.json(results);
      })

      .catch(function ( error ) {
        console.log(error);
        return res
          .status(500)
          .send({ message: 'ERROR',
                  error: error,
                  stack: error.stack });
      });
  });

  router.get('/restaurants/:id', function ( req, res, _ ) {
    api.handlers
      .getRestaurants(
        // REFACTOR
        // Limit attributes
        null, // select *
        { id: req.params.id })

      .then(function ( results ) {
        return res.json(results);
      })

      .catch(function ( error ) {
        console.error(error);
        return res
          .status(500)
          .send({ message: 'ERROR',
                  error: error,
                  stack: error.stack });
      });
  });

  return api;
};

