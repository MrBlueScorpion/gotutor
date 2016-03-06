module.exports = ['$scope', '$state', '$stateParams', 'AuthService', 'toastr', '$uibModal', function($scope, $state, $stateParams, AuthService, toastr, $uibModal) {
  $scope.signUp = function(user) {
    if ($scope.link) {
      AuthService.registerUserWithLink(user.email, user.password, $scope.link)
      .then(function() {
        // Somehow chrome browser failed to set cookie, hence we require user to log in again
        $state.go('login');
        toastr.success("Registration succeeded. Please log in again to see your profile")
      }, toastr.error.bind(toastr));  
    } else {
      AuthService.registerUser(user.email, user.password)
      .then(function() {
        $state.go('user.profile');
      }, toastr.error.bind(toastr));
    }
  };

  $scope.viewTerms = function(size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'components/auth/termsAndConditions.html',
      controller: 'TermsAndConditionsController',
      size: size
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  }
  
  $scope.link = $stateParams.link
}];
