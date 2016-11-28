var r = require('ramda');

var api = module.exports = function ( models, router ) {

  var
  getModel = r.prop(r.__, models),
  muralQuery = r.partial(r.__, [getModel('Mural')]),
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

console.log(options);

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

  router.get('/murals', function ( req, res, next ) {
    api.handlers
      .getMurals(
        null, null,
        { year: req.query.year })
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

  // events...

  return api;

};

