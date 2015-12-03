'use strict';

var constant = require('../../app.constant');

var generateApiUrl = function(action) {
  return 'https://' + constant.TUTOR_API + '/' + action;
};

var generateQueryUrl = function(action) {
  return 'http://' + constant.TUTOR_QUERY + '/' + action;
};

module.exports = {
  generateApiUrl : generateApiUrl,
  generateQueryUrl : generateQueryUrl
};