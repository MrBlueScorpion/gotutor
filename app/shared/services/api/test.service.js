'use strict';

module.exports = ['$stateParams', function ($stateParams) {
  return {
    getTest: function() {
      return $stateParams.test;
    },
    setTest: function(test) {
      // TODO
    }
  }
}];