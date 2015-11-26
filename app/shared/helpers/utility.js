'use strict';

define(function(require) {

  var constant = require('app.constant');

  var generateApiUrl = function(action) {
    return 'https://' + constant.TUTOR_API + '/' + action;
  };

  var generateQueryUrl = function(action) {
    return 'http://' + constant.TUTOR_QUERY + '/' + action;
  };

  return {
    generateApiUrl : generateApiUrl,
    generateQueryUrl : generateQueryUrl
  }
});
