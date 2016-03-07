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

    $scope.originImage = null
    $scope.croppedImage = ''

    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };

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
      var reader = new FileReader();
      reader.onload = function() {
        $scope.originImage = reader.result;
        if (!hasItemInQueue) hasItemInQueue = true;
        else $scope.uploader.removeFromQueue(0)
      };
      reader.readAsDataURL(item._file);
    };

    $scope.upload = function () {
      $scope.uploader.uploadItem(0);
    };

    $scope.uploader.onBeforeUploadItem = function(item) {
      var blob = dataURItoBlob($scope.croppedImage);
      item._file = blob;
      console.log(item, $scope.uploader.isFileLikeObject(item))
    };
    $scope.uploader.onCompleteAll = function() {
      toastr.success('Image uploaded');
    };
  }];