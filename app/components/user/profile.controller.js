'use strict';

module.exports = ['$scope', 'toastr', '$http', "$q", 'TutorApiService', 'AuthService',
  function ($scope, toastr, $http, $q, TutorApiService, AuthService) {
    $scope.tutor = {
      name: null,
      gender: null,
      rate: [15, 100],
      locations: [],
      subjects: []
    };
    $scope.locationEditable = false;
    $scope.subjectEditable = false;

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
      subjects: _.map(tutor.subjects, function (s) {
        return s.text.trim();
      }),
      rate: { min: $scope.rate[0], max: $scope.rate[1] },
      gender: tutor.gender,
      phone: tutor.phone
    }).then(function (response) {
      toastr.success(response.success);
      AuthService.setDisplayName(tutor.name)
    });
  };

  $scope.removeOption = function (index, modal) {
    $scope.tutor[modal].splice(index, 1);
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

  $scope.format = function ($model) {
    return '';
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

  $scope.toggleEditable = function (modal) {
    $scope[modal] = $scope[modal] == false;
  };

  $scope.addOption = function (option, modal) {
    var duplicate = false;
    _.each($scope.tutor[modal], function (location) {
      if (location.id == option.id) {
        toastr.error(option.text + ' already exits in the your ' + modal + ' list');
        duplicate = true;
      }
    });

    if (!duplicate) {
      $scope.tutor[modal].push(option);
    }
  };
}];