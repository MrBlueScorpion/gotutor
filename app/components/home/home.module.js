'use strict';

define(function(require){

  require('angular');

  var HomeController = require('components/home/home.controller');

  var app = angular.module('app.home', []);

  app.controller('HomeController', HomeController);

  return app;
});