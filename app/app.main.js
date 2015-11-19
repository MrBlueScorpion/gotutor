'use strict';

require([
  'angular',
  'angular-toastr',
  'angular-ui-router',
  'underscore',
  'app.module'
  ],

  function (angular) {
    var $html = angular.element(document.getElementsByTagName('html'));

    angular.element().ready(function() {
      angular.bootstrap(document, ['app']);
    });
  });


