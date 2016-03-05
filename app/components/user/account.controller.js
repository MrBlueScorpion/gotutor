'use strict';

module.exports = ['$scope', 'AuthService', 'toastr', '$http',
  function($scope, AuthService, toastr, $http) {

    $scope.changePassword = function() {
      AuthService.changePassword($scope.oldPass, $scope.newPass)
      .then(function(d, e) {
        toastr.success("Password updated.");
      }, function (e) {
        toastr.error(e);
      })
    };
    
    $scope.deleteAccount = function() {
      AuthService.deleteAccount().catch(toastr.error.bind(toastr))
    }
}];