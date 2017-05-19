module.exports = (grunt) => {
  grunt.initConfig({
    sass: {
      development: {
        options: {
        },
        files: {
          'assets/css/style.css': 'assets/sass/style.scss'
        }
      },
      production: {
        options: {
        },
        files: {
          'assets/css/style.css': 'assets/sass/style.scss'
        }
      }
    },
    watch: {
      files: ['<%= sass.files %>'],
      tasks: ['sass']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass']);
  grunt.registerTask('heroku:production', 'sass');
};