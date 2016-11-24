module.exports = function( grunt ) {
  grunt.initConfig({
    exec: { 
      create: {
        cmd: function ( admin ) {
          return './create ' + admin;
        }},
      destroy: {
        cmd: function ( admin ) {
          return './destroy ' + admin;
        }},
      import: {
        cmd: 'node importer-exporter.js importer' },
      export: {
        cmd: 'node importer-exporter.js exporter' }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-requirejs');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-mustache-render');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('create', function ( ) {
    if (!grunt.option('mysql-admin')) {
      throw new Error('no --mysql-admin option'); }
    grunt.tasks(['exec:create:' + grunt.option('mysql-admin')]);
  });

  grunt.registerTask('destroy', function ( ) {
    if (!grunt.option('mysql-admin')) {
      throw new Error('no --mysql-admin option'); }
    grunt.tasks(['exec:destroy:' + grunt.option('mysql-admin')]);
  });

  grunt.registerTask('import', ['exec:import']);

  grunt.registerTask('export', ['exec:export']);

  grunt.registerTask('build', function (  ) {
    var admin = grunt.option('mysql-admin');
    if (!admin) {
      throw new Error('no --mysql-admin option'); }

    grunt.tasks(['exec:create:' + admin,
                 'exec:import',
                 'exec:export']);
  });
};
