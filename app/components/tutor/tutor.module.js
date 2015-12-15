'use strict';

var TutorsListController = require('./tutors.controller');

var TutorApiService = require('../../shared/services/api/tutor.service');

var RegisterController = require('../auth/register.controller'),
    TermsAndConditionsController = require('../auth/termsAndConditions.controller'),
    ProfileController = require('../user/profile.controller'),
    MessageController = require('../user/message.controller'),
    TutorController = require('../tutor/tutor.controller'),
    LoginController = require('../auth/login.controller');

var app = angular.module('app.tutor',[]);

app.controller('TutorsListController', TutorsListController);

app.controller('RegisterController', RegisterController)
    .controller('TermsAndConditionsController', TermsAndConditionsController)
    .controller('ProfileController', ProfileController)
    .controller('MessageController', MessageController)
    .controller('TutorController', TutorController)
    .controller('LoginController', LoginController);

app.service('TutorApiService', TutorApiService);

module.exports = app;

