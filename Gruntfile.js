module.exports = function (grunt) {
  var config = {
    jshint: {
      options: {
        ignores: ['node_modules/**', 'public/vendor/**', '**/*.min.js', './app/config.js'],
        jshintrc: '.jshintrc'
      },
      gruntfile: 'Gruntfile.js',
      server: ['app/**/*.js', 'controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'app.js', 'config.js'],
      client: 'public/js/**/*.js'
    },
    concat: {
      css: {
        files: {
          src: ['public/vendor/bootstrap/dist/css/bootstrap.min.css', 'public/css/styles.min.css'],
          dest: 'public/css/app.styles.min.css'
        }
      }
    },
    uglify: {
      options: {
        mangle: {
          except: ['jQuery']
        }
      },
      target: {
        'public/js/app.min.js': ['public/vendor/jquery/dist/jquery.min.js', 'public/vendor/bootstrap/dist/js/bootstrap.min.js', 'public/js/main.js']
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'public/less',
          src: ['**/*.less'],
          dest: 'public/css',
          ext: '.css'
        }]
      }
    },
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    cssmin: {
      src: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: '**/*.css',
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },
    'node-inspector': {
      options: {
        'save-live-edit': true
      }
    },
    watch: {
      all: {
        files: ['public/**/*', 'views/**', 'app/**/*', '!**/node_modules/**', '!public/vendor/**/*', '!**/*.min.*'],
        options: {
          livereload: 3006
        }
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      scripts: {
        files: 'public/js/**/*.js',
        tasks: ['jshint:client', 'uglify']
      },
      server: {
        files: '<%= jshint.server %>',
        tasks: 'jshint:server'
      },
      sass: {
        files: ['public/sass/**/*.sass'],
        tasks: ['sass', 'cssmin', 'concat:css']
      }
    },
    concurrent: {
      tasks: ['node-inspector', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  };

  grunt.initConfig(config);

  // Load the tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', [
    'jshint',
    'nodemon'
    ]);

  grunt.registerTask('build', [
    'jshint', 
    'uglify', 
    // 'sass', 
    'cssmin', 
    'concat:css', 
    'concurrent'
    ]);

  grunt.registerTask('deploy', function() {
    if(grunt.option('prod')) {
      grunt.task.run([
        'build'
      ]);
    } else {
      grunt.task.run([
        'build',
        'nodemon'
      ]);
    }
  });
};