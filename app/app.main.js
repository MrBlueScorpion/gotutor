'use strict';

window.$ = window.jQuery = require('jquery')
window.$.waypoints = require('waypoints')
require('angular')
require('bootstrap')
require('bootstrap-select')
window._ = require('underscore')
require('./app.module')

angular.element().ready(function() {
  angular.bootstrap(document, ['app']);
});



