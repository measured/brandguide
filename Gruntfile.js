'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Night gathers, and now my grunt watch begins...
    watch: {

      options: {
        livereload: true,
      },

      railz: {
        // OFF DA RAILZ
        files: 'app/**/*'
      }

    }

  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task to be run.
  grunt.registerTask('default', ['watch']);
};