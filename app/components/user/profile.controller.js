'use strict';

module.exports = ['$scope', 'toastr', '$http', "$q", '$timeout', 'TutorApiService', 'AuthService',
  function ($scope, toastr, $http, $q, $timeout, TutorApiService, AuthService) {
    $scope.tutor = {
      name: null,
      gender: null,
      rate: [15, 100],
      locations: [],
      subjects: []
    };
    $scope.location = {};
    $scope.subject = {};

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
    var imageUploadToken = $q.defer();
    $scope.imageUploadToken = imageUploadToken.promise;
    AuthService.isAuthenticated().then(function () {
      TutorApiService.getTutorProfile().then(function (data) {
        $scope.tutor = data;
        $scope.tutor.locations = $scope.tutor.locations || [];
        $scope.tutor.subjects = ($scope.tutor.subjects || []).map(function(x) {return x.text});
        if (data.image) $scope.tutorImageUrl = "http://www.gotute.com/images/" + data.image;
        if (data) {
          $scope.rate = [data.rate.min || 15, data.rate.max || 200];
        }
      }, toastr.info.bind(toastr))
      .finally(function() {
        imageUploadToken.resolve(AuthService.getCurrentUser().token);
        showLoader(false);
      });
  });

  $scope.updateProfile = function (tutor) {
    return TutorApiService.updateTutorProfile({
      name: tutor.name,
      locations: _.map(tutor.locations, function (location) {
        return location.id;
      }),
      subjects: tutor.subjects,
      rate: { min: $scope.rate[0], max: $scope.rate[1] },
      gender: tutor.gender,
      phone: tutor.phone,
      description: tutor.description
    }).then(function (response) {
      toastr.success(response.success);
      AuthService.setDisplayName(tutor.name)
    });
  };

  $scope.getLocations = function (location) {
    return TutorApiService.getLocations(location).then(function (locations) {
      return locations;
    })
  };

  $scope.getSubjects = function (subject) {
    return TutorApiService.getSubjects(subject).then(function (subjects) {
      return subjects;
    })
  };

  $scope.tutorImageUrl = "assets/img/default-avatar.jpg";
  $scope.genderOptions = ['Male', 'Female'];

  $scope.rateOptions = {
    min: 10,
    max: 200,
    step: 1
  };

  $scope.formatRate = function (value) {
    if (!_.isUndefined(value))
      return '$' + value[0] + '/hr  to  $' + value[1] + '/hr';
  };

  $scope.removeOption = function (index, modal) {
    $scope.tutor[modal].splice(index, 1);
  };

  $scope.addLocation = function (option) {
    if (!_.some($scope.tutor.locations, function(x) { x.id == option.id })) {
      $scope.tutor.locations.push(option);
    }
    $scope.location.text = '';
  };

  $scope.addSubject = function (option) {
    option = (option.text || option).trim();
    if (!_.some($scope.tutor.subjects, function(x) { x == option })) {
      $scope.tutor.subjects.push(option);
    }
    $scope.subject.text = '';
  };
}];