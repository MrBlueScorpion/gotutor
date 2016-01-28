'use strict';

module.exports = ['$scope', 'toastr', '$http', 'TutorApiService', function($scope, toastr, $http, TutorApiService){
  TutorApiService.getTutorProfile().then(function(response) {
    if (angular.isDefined(response.error)) {
      toastr.info(response.error);
      $scope.tutor = {
        name : null,
        gender : null,
        rate : [15, 100],
        locationEditable : false,
        locations : [
        ],
        subjectEditable : false,
        subjects : [

        ]
      };
    } else {


    }
  });
  $scope.genderOptions = ['Male', 'Female'];

  $scope.rateOptions = {
    min: 15,
    max: 100,
    step: 1
  };


  $scope.locations = [];

  $scope.format = function(value) {
    if (!_.isUndefined(value))
    return 'From $' + value[0] + '/hr  to  $' + value[1] + '/hr';
  };

  //$scope.selectedItem= $scope.itemArray[0];


  $scope.toggleEditable = function(modal) {
    $scope.tutor[modal] = $scope.tutor[modal] == false;
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
        "email": [ "test@test.com" ]
    }
    }*/
    tutor.locationIds = _.map(tutor.locations, function(location) {
      return location.id;
    });

    console.log(tutor);
    TutorApiService.updateTutorProfile(tutor).then(function(tutor) {
      console.log(tutor);
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