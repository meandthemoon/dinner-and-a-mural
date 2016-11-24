var express = require('express');

var routes = module.exports = function ( server, models ) {
  /*  models  */
  var modelRoutes = express.Router();
  server.use('/api', modelRoutes);

  modelRoutes.get('/data-sources', function( req, res, next ) { 
    models.DataSources.findAll({
      attributes: ['website', 'link']
    }).then(function ( items ) {
      res.status(200).send({
        data: items,
        status: 'success'
      });
    }).catch(function ( error ) {
      res.status(500)
        .send({
          data: null,
          status: 'error'
        });
    });
  });


  // ......................................
  // catch 404 and forward to error handler
  server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  // 
  server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 404) {
      res.send({
        message: err.toString(),
        status: 'fail'
      });
    } else {
      res.send({
        message: 'An application error occurred',
        status: 'error'
      });
    }

  });


  return routes;
};
