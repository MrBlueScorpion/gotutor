'use strict';

define(function(require) {

  require('angular');


  var RegisterController = require('components/tutor/register.controller');
  var ProfileController = require('components/tutor/profile.controller');
  var TutorApiService = require('shared/services/api/tutor.service');

  var app = angular.module('app.tutor',[]);

  app.controller('RegisterController', RegisterController)
     .controller('ProfileController', ProfileController);
  app.service('TutorApiService', TutorApiService);

  return app;

});
