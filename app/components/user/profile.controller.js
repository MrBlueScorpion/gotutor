'use strict';

module.exports = ['$scope', 'toastr', '$http', 'TutorApiService', function($scope, toastr, $http, TutorApiService){
 $scope.tutor = {
    name : null,
    gender : null,
    rate : [15, 100],
    locations : [
    ],
    subjects : [

    ]
  };
  $scope.locationEditable = false;
  $scope.subjectEditable = false;
  TutorApiService.getTutorProfile().then(function(response) {
    if (angular.isDefined(response.error)) {
      toastr.info(response.error);

    } else {

      $scope.tutor = response;
      $scope.rate = [$scope.tutor.rate.min, $scope.tutor.rate.max];
    }
  });
  $scope.genderOptions = ['Male', 'Female'];

  $scope.rateOptions = {
    min: 15,
    max: 100,
    step: 1
  };

  $scope.format = function(value) {
    if (!_.isUndefined(value))
    return 'From $' + value[0] + '/hr  to  $' + value[1] + '/hr';
  };


  $scope.toggleEditable = function(modal) {
    $scope[modal] = $scope[modal] == false;
    $scope.$broadcast('SetFocus');
  };

  $scope.addOption = function(option, modal) {
    var duplicate = false;

    _.each($scope.tutor[modal], function(location) {
      if (location.id == option.id) {
        toastr.error(option.text + ' already exits in the your list');
        duplicate = true;
      }
    });

    if (!duplicate) {
      $scope.tutor[modal].push(option);
    }
  };


  $scope.updateProfile = function(tutor) {
  /*  {
      "name": "John Smith",
      "locationIds": ["1", "2"],
      "subjects": ["Math", "English"],
      "gender": "Male",
      "description": "I am specialized in teaching...",
      "rate": {
        "min": 20,
        "max": 50
    },
      "contact": {
      "phone": [ "0412345678", "0456788765" ],

    }
    }*/
    tutor.locationIds = _.map(tutor.locations, function(location) {
      return location.id;
    });

    console.log(tutor);
    TutorApiService.updateTutorProfile(tutor).then(function(response) {
      toastr.success(response.success);
    });
  };

  $scope.removeOption = function(index, modal) {
    $scope.tutor[modal].splice(index, 1);
  };


  $scope.getLocations = function(location) {
    TutorApiService.getLocations(location).then(function(locations) {
      $scope.locations = locations;
      $scope.noResults = locations.length == 0;
      return locations;
    })
  };


  
}];