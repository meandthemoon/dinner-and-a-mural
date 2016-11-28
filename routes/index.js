var express = require('express');

var routes = module.exports = function ( server, models ) {
  /*  models  */
  var apiRouter = express.Router();
  server.use('/api', apiRouter);
  require('./api')(models, apiRouter);

  
  // ......................................
  // catch 404 and forward to error handler
  server.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // server.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   if (err.status === 404) {
  //     res.send({
  //       message: err.toString(),
  //       status: 'fail'
  //     });
  //   } else {
  //     res.send({
  //       message: 'An application error occurred',
  //       status: 'error'
  //     });
  //   }
  // });

  return routes;
};
