'use strict';

require('angular')

require('./app.module')

angular.element().ready(function() {
  angular.bootstrap(document, ['app']);
});



