'use strict';

require('angular')
window._ = require('underscore')
require('./app.module')

angular.element().ready(function() {
  angular.bootstrap(document, ['app']);
});



