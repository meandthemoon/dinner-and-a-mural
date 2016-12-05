var express = require('express');
var routes = module.exports = function ( server, models ) {

  var apiRouter = express.Router();
  server.use('/api', apiRouter);
  require('./api')(models, apiRouter);

  /* catch 404 */
  server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  return routes;
};
