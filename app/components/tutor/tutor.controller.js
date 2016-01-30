module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', 'toastr', '$location', '$state',
  function($scope, $stateParams, tutorId, TutorApiService, toastr, $location, $state) {

  TutorApiService.getTutorById(tutorId).then(function(tutor) {
    if (!_.isUndefined(tutor.error)) {
      //$state.go('tutors');
    } else {
      $scope.tutor = tutor;
      $scope.enquiry = {};
    }

  });


  $scope.sendEnquiry = function() {
    $scope.enquiry.tutorId = tutorId;
    console.log($scope.enquiry);
    TutorApiService.sendMessage($scope.enquiry).then(function(response) {
      console.log(response);
      if (!_.isUndefined(response.success)) {
        toastr.success(response.success);
        $scope.enquiry = {};
      }
    });
  }


}];
