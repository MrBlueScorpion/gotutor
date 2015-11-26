module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/tests/test.main.js',
      { pattern: 'app/bower_components/jquery/dist/jquery.js', included: false },
      { pattern: 'app/bower_components/angular/angular.js', included: false },
      { pattern: 'app/bower_components/angular-route/angular-route.js', included: false },
      { pattern: 'app/bower_components/angular-animate/angular-animate.js', included: false },
      { pattern: 'app/bower_components/angular-sanitize/angular-sanitize.js', included: false },
      { pattern: 'app/bower_components/angular-toastr/dist/angular-toastr.tpls.min.js', included: false },
      { pattern: 'app/bower_components/angular-ui-router/release/angular-ui-router.js', included: false },
      { pattern: 'app/bower_components/angular-mocks/angular-mocks.js', included: false },
      { pattern: 'app/bower_components/underscore/underscore.js', included: false },
      { pattern: 'app/*.js', included: false },
      { pattern: 'app/components/**/*.js', included: false },
      { pattern: 'app/shared/**/*.js', included: false },
      { pattern: 'app/tests/*.js', included: false },
      //'app/view*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine', 'requirejs'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-requirejs'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    reporters: ['progress', 'junit']

  });
};
