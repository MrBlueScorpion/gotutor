'use strict';

module.exports = ['$scope', 'AuthService', 'toastr', '$state', 'AUTH_EVENTS', '$rootScope',
  function($scope, AuthService, toastr, $state, AUTH_EVENTS, $rootScope) {
  $scope.login = function(user) {
    AuthService.loginUser(user.email, user.password).then(function(user) {
      if (_.isUndefined(user.error)) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        $state.go('user.profile');
        toastr.success('Welcome back, ' + user.displayName);
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        toastr.error(user.error);
      }
    });
  }
}];