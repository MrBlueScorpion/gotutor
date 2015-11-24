define(function(require){

  return ['$scope', 'TutorApiService', 'toastr', '$state', function($scope, TutorApiService, toastr, $state) {

    $scope.signUp = function(user) {
      TutorApiService.registerUser(user.email, user.password).then(function(response) {
        console.log(response);
      });

      toastr.success('Successfully', 'Successfully');
      //$state.go('profile');
      return true;

    }

  }];

});
