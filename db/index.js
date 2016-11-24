var
Database = require('sequelize'),
r = require('ramda');

/* Factory: Returns a promise that resolves upon database connection.
   Params: Sequelize configuration options */
var db = module.exports = r.partial(function ( schema, config ) {
  if (!config) {
    throw Error('Configuration required for database connection.'); }
  
  db.instance = new Database(config.database,
                             config.username,
                             config.password,
                             config.options);

  db.defineModel = r.curry(function ( instance, memo, schemaOptions ) {
    var defineArgs = schemaOptions.definition;
    return r.assoc(schemaOptions.name,
                   instance.define.apply(instance, defineArgs),
                   memo);
  });

  db.models = r.reduce(db.defineModel(db.instance), {}, schema);

  return db.instance.sync();

}, [require('./schema')]);
