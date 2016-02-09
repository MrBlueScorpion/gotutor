'use strict';

module.exports = ['$scope', 'toastr', '$http', 'TutorApiService', 'AuthService',
  function($scope, toastr, $http, TutorApiService, AuthService){
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

  AuthService.isAuthenticated().then(function(response) {
    if (response.user) {
      TutorApiService.getTutorProfile().then(function(response) {
        if (angular.isDefined(response.error)) {
          toastr.info(response.error);
        } else {
          $scope.tutor = response;
          $scope.tutor.locations = [];
          $scope.rate = [$scope.tutor.rate.min, $scope.tutor.rate.max];
        }
      });
    }
  });

  $scope.genderOptions = ['Male', 'Female'];

  $scope.rateOptions = {
    min: 15,
    max: 100,
    step: 1
  };

  $scope.formatRate = function(value) {
    if (!_.isUndefined(value))
    return 'From $' + value[0] + '/hr  to  $' + value[1] + '/hr';
  };


  $scope.toggleEditable = function(modal) {
    $scope[modal] = $scope[modal] == false;
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

    tutor.rate.min = $scope.rate[0];
    tutor.rate.max = $scope.rate[1];

    console.log(tutor);
    TutorApiService.updateTutorProfile(tutor).then(function(response) {
      toastr.success(response.success);
    });
  };

  $scope.removeOption = function(index, modal) {
    $scope.tutor[modal].splice(index, 1);
  };

  $scope.getLocations = function(location) {
    return TutorApiService.getLocations(location).then(function(locations) {
      return locations;
    })
  };

  $scope.format = function ($model) {
    return '';
  }
  
}];