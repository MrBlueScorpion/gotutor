'use strict';

require([
  'app.module',
  'underscore'
], function () {
  var $html = angular.element(document.getElementsByTagName('html'));

  angular.element().ready(function() {
    angular.bootstrap(document, ['app']);
  });
});


