'use strict';

module.exports = ['$scope', 'AuthService', 'toastr', '$state', 'AUTH_EVENTS', '$rootScope',
  function($scope, AuthService, toastr, $state, AUTH_EVENTS, $rootScope) {
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
}];