module.exports = ['$scope', 'AuthService', 'toastr', '$state', '$uibModal', function($scope, AuthService, toastr, $state, $uibModal) {
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


  $scope.viewTerms = function(size) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'components/auth/termsAndConditions.html',
      controller: 'TermsAndConditionsController',
      size: size,
      //resolve: {
      //  items: function () {
      //    return $scope.items;
      //  }
      //}
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      //$log.info('Modal dismissed at: ' + new Date());
    });
  }



}];
