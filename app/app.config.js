require.config({
  deps: [
    'app.main'
  ],
  baseUrl: '.',
  priority: [
    'angular',
    'jquery',
    'underscore'
  ],
  paths: {
    'angular': 'bower_components/angular/angular',
    'angular-route': 'bower_components/angular-route/angular-route',
    'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
    'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
    'underscore' : 'bower_components/underscore/underscore',
    'angular-animate': 'bower_components/angular-animate/angular-animate',
    'angular-toastr' : 'bower_components/angular-toastr/dist/angular-toastr.tpls.min',
    'bootstrap' : 'bower_components/bootstrap/dist/js/bootstrap',
    'bootstrap-select' : 'bower_components/bootstrap-select/dist/js/bootstrap-select',
    'angular-bootstrap-select': 'bower_components/angular-bootstrap-select/build/angular-bootstrap-select',
    'jquery' : 'bower_components/jquery/dist/jquery',
    'superfish' :'bower_components/superfish/dist/js/superfish',
    'ng-file-upload' : 'bower_components/ng-file-upload/ng-file-upload.min',
    'waypoints' : 'bower_components/waypoints/lib/jquery.waypoints',
    'angular-ui-select' : 'bower_components/ui-select/dist/select',
    'angular-sanitize' : 'bower_components/angular-sanitize/angular-sanitize',
    'angular-bootstrap-checkbox' : 'bower_components/angular-bootstrap-checkbox/angular-bootstrap-checkbox',
    'angular-cookies' : 'bower_components/angular-cookies/angular-cookies',
    'angular-bootstrap' : 'bower_components/angular-bootstrap/ui-bootstrap-tpls',
    'seiyria-bootstrap-slider' : 'bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min'
    // text: 'bower_components/requirejs-text/text'
  },
  shim: {
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
    'angular-bootstrap-select' : [
      'angular',
      'jquery',
      'bootstrap-select'
    ],
    'suerpfish' : [
      'jquery'
    ],
    'ng-file-upload' : [
      'angular'
    ],
    'waypoints' : [
      'jquery'
    ],
    'angular-ui-select': [
      'angular'
    ],
    'angular-sanitize' : [
      'angular'
    ],
    'angular-bootstrap-checkbox' : [
      'angular'
    ],
    'angular-cookies' : [
      'angular'
    ],
    'angular-bootstrap' : [
      'angular'
    ],
    'seiyria-bootstrap-slider' : [
      'jquery'
    ]
  }
});