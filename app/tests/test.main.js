require.config({
  deps: [
    'tests/tutors.controller.test'
  ],
  baseUrl: './base/app/',
  priority: [
    'angular',
    'underscore'
  ],
  paths: {
    'jquery': 'bower_components/jquery/dist/jquery',
    'angular': 'bower_components/angular/angular',
    'angular-route': 'bower_components/angular-route/angular-route',
    'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'underscore' : 'bower_components/underscore/underscore',
    'angular-animate': 'bower_components/angular-animate/angular-animate',
    'angular-toastr' : 'bower_components/angular-toastr/dist/angular-toastr.tpls.min',
    'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize'
  },
  shim: {
    'jquery': {
      'exports': '$'
    },
    'angular': {
      'exports': 'angular'
    },
    'angular-route': [
      'angular'
    ],
    'angular-mocks': {
      deps: [
        'angular'
      ],
      'exports': 'angular.mock'
    },
    'angular-ui-router' : [
      'angular'
    ],
    'angular-animate' : [
      'angular'
    ],
    'angular-toastr' : [
      'angular',
      'angular-animate'
    ],
    'angular-sanitize' : [
      'angular'
    ]
  },
  callback: window.__karma__.start
});