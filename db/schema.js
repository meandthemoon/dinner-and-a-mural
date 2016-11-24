var schema = module.exports = (function ( Database ) {
  return [{
    modelName: 'Restaurant',
    definition: ['restarant', {
      name: { type: Database.STRING }}]
  }, {
    modelName: 'Mural',
    definition: ['mural', {
      name: { type: Database.STRING,
              field: 'name' }}]
  }];

}(require('sequelize')));
