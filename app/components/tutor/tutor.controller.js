module.exports = ['$scope', '$stateParams', 'tutorId', function($scope, $stateParams, tutorId) {
  console.log($stateParams.tutorId);
  console.log(tutorId);
}];
