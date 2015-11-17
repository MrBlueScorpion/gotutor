'use strict';

define(function(require) {

  require('angular');

  var HomeController = require('components/home/home.controller');

  var TutorApiService = require('shared/services/api/tutor.service');

  var app = angular.module('app.home', []);

  app.controller('HomeController', HomeController);
  app.service('TutorApiService', TutorApiService);

  return app;
});