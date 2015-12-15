module.exports = ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {

  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  }
}];