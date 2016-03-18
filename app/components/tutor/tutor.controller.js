module.exports = ['$scope', '$stateParams', 'tutorId', 'TutorApiService', 'toastr', '$location', '$state',
  function ($scope, $stateParams, tutorId, TutorApiService, toastr, $location, $state) {
    var showLoader = function (show) {
      if (show) {
        $('#status').show();
        $('#preloader').show();
      } else {
        $('#status').hide();
        $('#preloader').hide();
      }
    };

    showLoader(true);
    TutorApiService.getTutorById(tutorId).then(function (tutor) {
      tutor.description = tutor.description.replace(/\n/g, '<br><br>');
      $scope.tutor = tutor;
      $scope.enquiry = {};
    }, function() {
      $scope.tutor = null;
    }).finally(showLoader);

    $scope.sendEnquiry = function () {
      $scope.enquiry.tutorId = tutorId;
      return TutorApiService.sendMessage($scope.enquiry).then(function (response) {
        if (!_.isUndefined(response.success)) {
          toastr.success(response.success);
          $scope.$$childHead.enquiryForm.$setUntouched(); // maybe not a good way
          $scope.enquiry = {};
        }
      });
    };

    $scope.claimTutor = function (claim) {
      var data = {};
      data.tutorId = tutorId;
      data[claim.option] = claim.value;
      return TutorApiService.claimTutor(data)
        .then(function (data) {
          $state.go('register', data);
        }, toastr.error.bind(toastr));
    };

    $scope.claim = {
      options : {
        fullname : 'Full Name',
        email: 'Email',
        phone: 'Contact Number'
      }
    }
  }];
