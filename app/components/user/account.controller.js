'use strict';

module.exports = ['$scope', 'AuthService', 'toastr',
  function($scope, AuthService, toastr) {

    $scope.changePassword = function() {
      return AuthService.changePassword($scope.oldPass, $scope.newPass)
      .then(function(d, e) {
        toastr.success("Password updated.");
      }, function (e) {
        toastr.error(e);
      })
    };
    
    $scope.deleteAccount = function() {
      return AuthService.deleteAccount().catch(toastr.error.bind(toastr))
    }
}];