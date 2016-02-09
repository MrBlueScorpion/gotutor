'use strict';

module.exports = ['$scope', 'TutorApiService', 'toastr', '$http',
  function($scope, TutorApiService, toastr, $http) {

    $scope.sendFeedback = function() {
      TutorApiService.sendFeedback($scope.feedback).then(function(response) {
        if (!_.isUndefined(response.success)) {
          toastr.success(response.success);
          $scope.feedback = {};
        }
      });
    };

}];