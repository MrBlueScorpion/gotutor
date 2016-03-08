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

    AuthService.isAuthenticated().then(function (user) {
      TutorApiService.getTutorProfile().then(function (data) {
        $scope.tutor = data;
        if ($scope.tutor.image) $scope.defaultImageUrl = $scope.tutor.image;
        if (data) {
          var minRate = $scope.tutor.rate.min ? $scope.tutor.rate.min : 15;
          var maxRate = $scope.tutor.rate.max ? $scope.tutor.rate.max : 100;
          $scope.rate = [minRate, maxRate];
        }
      }, toastr.info.bind(toastr));
    });

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

    $scope.uploader = new FileUploader({
      url : 'upload.php',
      queueLimit: 2
    });

    // FILTERS
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function(item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    var hasItemInQueue;

    $scope.uploader.onAfterAddingFile = function(item) {
      $scope.originImage = window.URL.createObjectURL(item._file);
      if (!hasItemInQueue) hasItemInQueue = true;
      else $scope.uploader.removeFromQueue(0)
    };

    $scope.onImageLoaded = function() {
      window.URL.revokeObjectURL($scope.originImage);
    }

    $scope.onCropped = function() {
      // TODO: this is just for the initial load of the image. Need to release for every single update.
      window.URL.revokeObjectURL($scope.croppedImageUri);
    }

    $scope.upload = function () {
      $scope.uploader.uploadItem(0);
    };

    $scope.cancel = function () {
      $scope.uploader.clearQueue();
      $scope.originImage = null;
    };

    $scope.uploader.onBeforeUploadItem = function(item) {
      var blob = $scope.croppedImage;
      item._file = blob;
      console.log(item, $scope.uploader.isFileLikeObject(item))
    };
    $scope.uploader.onCompleteAll = function() {
      toastr.success('Image uploaded');
    };
  }];