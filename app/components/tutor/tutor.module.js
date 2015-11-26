'use strict';

define(function(require) {

  var TutorsListController = require('components/tutor/tutors.controller');

  var TutorApiService = require('shared/services/api/tutor.service');

  var angular = require('angular');

  var app = angular.module('app.tutor',[]);

  app.controller('TutorsListController', TutorsListController);

  app.service('TutorApiService', TutorApiService);

  return app;

});
