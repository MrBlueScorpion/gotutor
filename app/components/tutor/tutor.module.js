'use strict';

define(function(require) {

  var TutorsListController = require('components/tutor/tutors.controller');

  var TutorApiService = require('shared/services/api/tutor.service');

  var angular = require('angular');

  var RegisterController = require('components/auth/register.controller'),
      ProfileController = require('components/user/profile.controller'),
      TutorController = require('components/tutor/tutor.controller'),
      LoginController = require('components/auth/login.controller');


  var app = angular.module('app.tutor',[]);

  app.controller('TutorsListController', TutorsListController);

  app.controller('RegisterController', RegisterController)
     .controller('ProfileController', ProfileController)
     .controller('TutorController', TutorController)
     .controller('LoginController', LoginController);

  app.service('TutorApiService', TutorApiService);

  return app;

});
