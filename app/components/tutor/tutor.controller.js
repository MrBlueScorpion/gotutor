module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', 'toastr', '$location', '$state',
  function($scope, $stateParams, tutorId, TutorApiService, toastr, $location, $state) {

  TutorApiService.getTutorById(tutorId).then(function(tutor) {
    if (!_.isUndefined(tutor.error)) {
      //$state.go('tutors');
    } else {
      $scope.tutor = tutor;
    }

  });


  $scope.sendEnquiry = function(enquiry) {
    enquiry.tutorId = tutorId;
    console.log(enquiry);
    TutorApiService.sendMessage(enquiry).then(function(response) {
      console.log(response);
      if (!_.isUndefined(response.success)) {
        toastr.success(response.success)
      }
    });
  }


}];
