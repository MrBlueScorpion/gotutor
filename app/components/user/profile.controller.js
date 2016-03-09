'use strict';

module.exports = ['$scope', 'toastr', '$http', 'TutorApiService', 'AuthService', 'FileUploader',
  function ($scope, toastr, $http, TutorApiService, AuthService, FileUploader) {
    $scope.tutor = {
      name: null,
      gender: null,
      rate: [15, 100],
      locations: [],
      subjects: []
    };
    $scope.locationEditable = false;
    $scope.subjectEditable = false;

    //show/hide loader
    $scope.showLoader = function (show) {
      if (show) {
        $('#status').show();
        $('#preloader').show();
      } else {
        $('#status').hide();
        $('#preloader').hide();
      }
    };

    $scope.showLoader(true);
    AuthService.isAuthenticated().then(function () {
      TutorApiService.getTutorProfile().then(function (data) {
        $scope.tutor = data;
        if ($scope.tutor.image) $scope.defaultImageUrl = "http://www.gotute.com/images/" + $scope.tutor.image;
        if (data) {
          var minRate = $scope.tutor.rate.min ? $scope.tutor.rate.min : 15;
          var maxRate = $scope.tutor.rate.max ? $scope.tutor.rate.max : 100;
          $scope.rate = [minRate, maxRate];
        }
      }, toastr.info.bind(toastr))
      .finally(function() {
        uploader.url = 'https://api.gotute.com/users/me/tutor/image?token=' + AuthService.getCurrentUser().token;
        $scope.showLoader(false);
      });
  });

  $scope.updateProfile = function (tutor) {
    tutor.locationIds = _.map(tutor.locations, function (location) {
      return location.id;
    });

    tutor.subjectIds = _.map(tutor.subjects, function (s) {
      return s.id;
    });

    tutor.rate.min = $scope.rate[0];
    tutor.rate.max = $scope.rate[1];

    TutorApiService.updateTutorProfile(tutor).then(function (response) {
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

  $scope.defaultImageUrl = "assets/img/default-avatar.jpg"
  $scope.originImage = null;
  $scope.croppedImage = ''


  var uploader = $scope.uploader = new FileUploader({
    queueLimit: 1
  });

  uploader.filters.push({
    name: 'imageFilter',
    fn: function(item, options) {
      var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    }
  });

  uploader.onAfterAddingFile = function(item) {
    $scope.originImage = window.URL.createObjectURL(item._file);
  };

  uploader.onBeforeUploadItem = function(item) {
    item.file.name = "image.png";
    item.file.type = "image/png";
    item._file = $scope.croppedImage;
  };

  uploader.onErrorItem = function(item, resp, status, headers) {
    toastr.error('Upload failed. Please try again');
  };

  uploader.onSuccessItem = function(item, resp) {
    uploader.clearQueue();
    $scope.originImage = null;
    $scope.defaultImageUrl = "http://www.gotute.com/" + resp;
    toastr.success('Image uploaded');
  };

  $scope.genderOptions = ['Male', 'Female'];

  $scope.rateOptions = {
    min: 15,
    max: 100,
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

  $scope.onImageLoaded = function() {
    window.URL.revokeObjectURL($scope.originImage);
  }

  $scope.onCropped = function() {
    // TODO: this is just for the initial load of the image. Need to release for every single update.
    window.URL.revokeObjectURL($scope.croppedImageUri);
  }

  $scope.upload = function (){
    uploader.uploadItem(0);
  };

  $scope.cancel = function () {
    uploader.clearQueue();
    $scope.originImage = null;
  };
}];