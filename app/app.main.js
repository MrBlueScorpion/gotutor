'use strict';

var $ = window.$ = window.jQuery = require('jquery');
var _ = window._ = require('underscore');
require('jquery-ui');
require('jquery.easing');
require('owl.carousel');

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