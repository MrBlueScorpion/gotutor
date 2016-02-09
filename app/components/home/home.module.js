'use strict';

var HomeController = require('../home/home.controller'),
    ErrorController = require('../404/404.controller'),
    AboutController = require('../about/about.controller');


var app = angular.module('app.home', []);

app.controller('HomeController', HomeController)
   .controller('ErrorController', ErrorController)
   .controller('AboutController', AboutController);

module.exports = app;
