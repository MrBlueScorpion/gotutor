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
    'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
    'bootstrap-select' : 'bower_components/bootstrap-select/dist/js/bootstrap-select',
    'angular-bootstrap-select': 'bower_components/angular-bootstrap-select/build/angular-bootstrap-select',
    'ng-file-upload' : 'bower_components/ng-file-upload/ng-file-upload.min',
    'angular-ui-select' : 'bower_components/ui-select/dist/select',
    'angular-bootstrap-checkbox' : 'bower_components/angular-bootstrap-checkbox/angular-bootstrap-checkbox',
    'angular-cookies' : 'bower_components/angular-cookies/angular-cookies'
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
    ],
    'ng-file-upload' : [
      'angular'
    ],
    'angular-ui-select': [
      'angular'
    ],
    'angular-bootstrap-checkbox' : [
      'angular'
    ],
    'angular-cookies' : [
      'angular'
    ],
    'angular-bootstrap-select' : [
      'angular',
      'jquery',
      'bootstrap-select'
    ]
  },
  callback: window.__karma__.start
});