module.exports = ['$scope', 'AuthService', 'toastr', '$state', function($scope, AuthService, toastr, $state) {
  $scope.signUp = function(user) {
    AuthService.registerUser(user.email, user.password).then(function(response) {
      if (!_.isUndefined(response.success)) {
        $state.go('user.profile');
        toastr.success('Success', 'Your have successfully register a tutor account');
      } else {
        toastr.error(response.error, 'Error');
      }
    });
  };
}];
