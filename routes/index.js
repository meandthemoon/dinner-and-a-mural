var
express = require('express'),
router = express.Router();

/* ''''''''''''''''''
   . data models web service
   ..................  */ 
var api = module.exports = function ( server, models ) {
  
  server.use('/api/models', router);

  router.get('/', function(req, res, next) { 
    res.status(200).send({
      message: 'okay',
      page: 'index',
      status: 200
    });
  });

};
