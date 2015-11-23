define(function(require){

  return ['$scope', 'TutorApiService', 'toastr','$state', function($scope, TutorApiService, toastr, $state) {

    $scope.signUp = function(username, password) {
      TutorApiService.registerUser(username, password).then(function(response){
        console.log(username,password);
      });

      toastr.success('Successfully', 'Successfully');
      $state.go('profile');
      return true;

    }

  }];

});
