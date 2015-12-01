'use strict';

var TutorsListController = require('./tutors.controller');

var TutorApiService = require('../../shared/services/api/tutor.service');

var RegisterController = require('../auth/register.controller'),
    ProfileController = require('../user/profile.controller'),
    TutorController = require('../tutor/tutor.controller'),
    LoginController = require('../auth/login.controller');


var app = angular.module('app.tutor',[]);

app.controller('TutorsListController', TutorsListController);

app.controller('RegisterController', RegisterController)
    .controller('ProfileController', ProfileController)
    .controller('TutorController', TutorController)
    .controller('LoginController', LoginController);

app.service('TutorApiService', TutorApiService);

module.exports = app;