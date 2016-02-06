'use strict';

var $ = jQuery = window.$ = window.jQuery = require('jquery');
var _ = window._ = require('underscore');
require('jquery-ui');
require('jquery.easing');
require('owl.carousel');

require('./vendor/superfish/dist/js/superfish.min.js');
require('./vendor/superfish/dist/js/hoverIntent.js');
require('./vendor/placeholdem.min.js');
require('./vendor/prettyphoto/js/jquery.prettyPhoto.js');
require('./vendor/jquery.smoothscroll.min.js');
require('./vendor/smooth-scrollbar.min.js');
require('./vendor/isotope/jquery.isotope.min.js');
//var jQBridget = require('jquery-bridget');
//var Isotope = require('isotope');
// make Isotope a jQuery plugin
//$.bridget('isotope', Isotope );

//$.waypoints = require('waypoints')
require('angular');
require('bootstrap-select');

require('./app.module');

angular.element().ready(function() {
  angular.bootstrap(document, ['app']);
});

//$(document).ready(function() {
//    $('#tutors-filter input').change(function(){
//        $('#tutors-filter').submit();
//    })
//});

require('./theme.js');




//require('jquery.smooth-scroll')