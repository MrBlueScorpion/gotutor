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

    //image crop and upload
    var uploader = $scope.uploader = new FileUploader({
      url : 'api/gotute.com/'
    });

    // FILTERS
    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // CALLBACKS
    /**
     * Show preview with cropping
     */
    uploader.onAfterAddingFile = function(item) {
      $scope.croppedImage = '';
      item.croppedImage = '';
      var reader = new FileReader();
      reader.onload = function(event) {
        $scope.$apply(function(){
          $scope.image = event.target.result;
        });
      };
      console.log(item);
      reader.readAsDataURL(item._file);
    };

    /**
     * Upload Blob (cropped image) instead of file.
     * @see
     *   https://developer.mozilla.org/en-US/docs/Web/API/FormData
     *   https://github.com/nervgh/angular-file-upload/issues/208
     */
    uploader.onBeforeUploadItem = function(item) {
      var blob = dataURItoBlob(item.croppedImage);
      item._file = blob;
    };

    /**
     * Converts data uri to Blob. Necessary for uploading.
     * @see
     *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     * @param  {String} dataURI
     * @return {Blob}
     */
    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: mimeString});
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
  }];