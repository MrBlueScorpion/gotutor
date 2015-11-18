'use strict';

define(function(require) {

  var constant = require('app.constant');

  var generateUrl = function(action) {
    return 'http://' + constant.TUTOR_API.HOST + ':' + constant.TUTOR_API.PORT + '/' + action;
  };

  return {
    generateUrl : generateUrl
  }
});
