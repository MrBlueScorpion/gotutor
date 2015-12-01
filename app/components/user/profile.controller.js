'use strict';

module.exports = ['$scope', 'toastr', '$http', function($scope, toastr, $http){

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

  $scope.addOption = function(option, modal) {

    if (_.isUndefined(option)) {
      toastr.error('Please select an option from the list', modal);
      return
    }

    if (_.indexOf($scope.user[modal], option) > -1){
      toastr.error(option + 'already exits in the your list', modal);
      return
    }

    $scope.user[modal].push(option);
    $scope.location = null;
    console.log($scope.location);
    $scope.subject = null;
    console.log($scope.user[modal]);
  };

  $scope.submit = function() {
    console.log($scope.user.locations);
  };

  $scope.removeOption = function(index, modal) {
    $scope.user[modal].splice(index, 1);
  };


  $scope.getLocation = function(val) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };



  $scope.sliders = {};
  $scope.sliders.sliderValue = 50;

  $scope.testOptions = {
    min: 0,
    max: 100,
    step: 1
  };
}];