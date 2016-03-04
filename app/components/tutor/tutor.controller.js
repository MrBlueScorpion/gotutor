module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', 'toastr', '$location', '$state',
  function($scope, $stateParams, tutorId, TutorApiService, toastr, $location, $state) {

  TutorApiService.getTutorById(tutorId).then(function(tutor) {
    if (!_.isUndefined(tutor.error)) {
      $scope.tutor = null;
    } else {
      $scope.tutor = tutor;
      $scope.enquiry = {};
    }
  });

  $scope.sendEnquiry = function() {
    $scope.enquiry.tutorId = tutorId;
    TutorApiService.sendMessage($scope.enquiry).then(function(response) {
      if (!_.isUndefined(response.success)) {
        toastr.success(response.success);
        $scope.enquiry = {};
      }
    });
  };

  $scope.claimTutor = function(claim) {
    var data = {};
    data.tutorId = tutorId;
    data[claim.option] = claim.value;
    TutorApiService.claimTutor(data).then(function(response) {
     if (!_.isUndefined(response.error)) {
        toastr.error(response.error);
     } else {
      $scope.link = response.link;
     }
    });
  }


}];
