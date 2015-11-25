'use strict';

define(function(require) {

  require('angular');


  var RegisterController = require('components/auth/register.controller'),
      ProfileController = require('components/user/profile.controller'),
      TutorController = require('components/tutor/tutor.controller'),
      LoginController = require('components/auth/login.controller');


  var app = angular.module('app.tutor',[]);

  app.controller('RegisterController', RegisterController)
     .controller('ProfileController', ProfileController)
     .controller('TutorController', TutorController)
     .controller('LoginController', LoginController);


  return app;

});
