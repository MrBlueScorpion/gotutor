define(function(require){

  return ['$scope', 'AuthenticateService', 'toastr', '$state', function($scope, AuthenticateService, toastr, $state) {

    $scope.signUp = function(user) {
      AuthenticateService.registerUser(user.email, user.password).then(function(response) {
        if (!_.isUndefined(response.success)) {
          $state.go('profile');
          toastr.success('Success', 'Your have successfully register a tutor account');
        } else {
          toastr.error('Error', response.error);
        }
      });

    };

    $scope.onChange = function() {
      console.log($scope.terms);
    }

  }];

});
