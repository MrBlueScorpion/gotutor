'use strict';

require([
  'angular',
  'app.module'
  ],

  function (angular) {
    var $html = angular.element(document.getElementsByTagName('html'));

    angular.element().ready(function() {
      angular.bootstrap(document, ['app']);
    });
  });


