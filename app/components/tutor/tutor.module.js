'use strict';

define(function(require) {

  require('angular');


  var RegisterController = require('components/tutor/register.controller'),
      ProfileController = require('components/tutor/profile.controller'),
      TutorController = require('components/tutor/tutor.controller'),
      TutorApiService = require('shared/services/api/tutor.service');

  var app = angular.module('app.tutor',[]);

  app.controller('RegisterController', RegisterController)
     .controller('ProfileController', ProfileController)
     .controller('TutorController', TutorController)
     .service('TutorApiService', TutorApiService);

  return app;

});
