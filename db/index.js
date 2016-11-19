var Sequelize = require('sequelize');

// module factory
var db = module.exports = function ( userConfig ) {
  var _config = { database: 'openBaltimore',     
                  username: 'anon',
                  password: 'I_@m_@n0N',
                  options: { dialect: 'mysql',
                             pool: { min: 1,
                                     max: 10,
                                     idle: 10000 } } };

  db.instance = (function ( config ) {
    return new Sequelize(config.database,
                         config.username,
                         config.password,
                         config.options || _config.options);
  }(userConfig || _config));
  
  return db;
};
