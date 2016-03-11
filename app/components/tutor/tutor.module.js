'use strict';

var TutorsListController = require('./tutors.controller');

var TutorApiService = require('../../services/tutor');

var RegisterController = require('../auth/register.controller'),
    TermsAndConditionsController = require('../auth/termsAndConditions.controller'),
    ProfileController = require('../user/profile.controller'),
    EnquiryController = require('../user/enquiry.controller'),
    AccountController = require('../user/account.controller'),
    TutorController = require('../tutor/tutor.controller'),
    LoginController = require('../auth/login.controller');

var app = angular.module('app.tutor',[]);

app.controller('TutorsListController', TutorsListController);

app.controller('RegisterController', RegisterController)
    .controller('TermsAndConditionsController', TermsAndConditionsController)
    .controller('ProfileController', ProfileController)
    .controller('EnquiryController', EnquiryController)
    .controller('AccountController', AccountController)
    .controller('TutorController', TutorController)
    .controller('LoginController', LoginController);

app.service('TutorApiService', TutorApiService);

module.exports = app;

