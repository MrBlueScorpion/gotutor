'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'AuthService', 'toastr',
  function($scope, $state, $stateParams, AuthService, toastr) {
  $scope.login = function(user) {
    return AuthService.loginUser(user.email, user.password).then(function() {
      $state.go('user.enquiries');
    }, function(e) {
      toastr.error(e);
    });
  }
  
  $scope.forgotPassword = function(user) {
    return AuthService.forgotPassword(user.email).then(function() {
      $scope.emailSent = true;
    }, function(e) {
      toastr.error(e);
    });
  }
  
  $scope.resetPassword = function(password) {
    return AuthService.resetPassword($stateParams.link, password).then(function() {
      toastr.success('Your password has been updated.');
      $state.go('login');
    }, function(e) {
      toastr.error(e);
    });
  }
}];