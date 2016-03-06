'use strict';

module.exports = ['$scope', '$state', '$stateParams', 'AuthService', 'toastr', 'AUTH_EVENTS', '$rootScope',
  function($scope, $state, $stateParams, AuthService, toastr, AUTH_EVENTS, $rootScope) {
  $scope.login = function(user) {
    AuthService.loginUser(user.email, user.password).then(function(response) {
      if (_.isUndefined(response.error)) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $state.go('user.profile');
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        toastr.error(response.error);
      }
    });
  }
  
  $scope.forgotPassword = function(user) {
    AuthService.forgotPassword(user.email).then(function() {
      $scope.emailSent = true;
    }, function(e) {
      toastr.error(e);
    });
  }
  
  $scope.resetPassword = function(password) {
    AuthService.resetPassword($stateParams.link, password).then(function() {
      toastr.success('Your password has been updated.');
      $state.go('login');
    }, function(e) {
      toastr.error(e);
    });
  }
}];