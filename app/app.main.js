'use strict';

var $ = window.$ = window.jQuery = require('jquery')
window.$.waypoints = require('waypoints')
require('angular')
require('bootstrap')
require('bootstrap-select')
window._ = require('underscore')

require('./app.module')

angular.element().ready(function() {
  angular.bootstrap(document, ['app']);
});

$(document).ready(function() {
    $('#tutors-filter input').change(function(){
        $('#tutors-filter').submit();
    })
});

window.theme = require('./theme.js')

var jQBridget = require('jquery-bridget');
var Isotope = require('isotope');
// make Isotope a jQuery plugin
$.bridget('isotope', Isotope );

require('jquery.easing')