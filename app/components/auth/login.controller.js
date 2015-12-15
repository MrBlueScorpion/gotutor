'use strict';

module.exports = ['$scope', 'AuthService', 'toastr', '$state', function($scope, AuthService, toastr, $state) {
  $scope.login = function(user) {
    AuthService.loginUser(user.email, user.password).then(function(response) {
      if (!_.isUndefined(response.success)) {
        $state.go('user.profile');
        toastr.success('Welcome back!!');
      } else {
        toastr.error(response.error);
      }
    });
  }
}];