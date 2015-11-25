'use strict';

define(function(require){

  return['$scope', 'toastr', function($scope, toastr){

    $scope.itemArray = [
      {id: 1, name: 'first'},
      {id: 2, name: 'second'},
      {id: 3, name: 'third'},
      {id: 4, name: 'fourth'},
      {id: 5, name: 'fifth'}
    ];

    //$scope.selectedItem= $scope.itemArray[0];
    $scope.user = {
      name : null,
      gender : null,
      rate : {
        max : null,
        min : null
      },
      locationEditable : false,
      locations : [
        'melbourne'
      ],
      subjectEditable : false,
      subjects : [

      ]
    };

    $scope.toggleEditable = function(modal) {
      $scope.user[modal] = $scope.user[modal] === false;
    };

    $scope.addLocation = function(location) {
      if (!_.isUndefined(location) && _.indexOf($scope.user.locations, location) < 0){
        $scope.user.locations.push(location);
        $scope.location = null;
      } else {
        toastr.error('Location already exists', location);
      }


      console.log($scope.user.locations);
    };

    $scope.submit = function() {
      console.log($scope.user.locations);
    };

    $scope.removeLocation = function(index) {
      $scope.user.locations.splice(index, 1);
    };
  }];
});
