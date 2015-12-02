'use strict';

module.exports = ['$scope', 'toastr', '$http', function($scope, toastr, $http){

  $scope.gender = [
    {id: 1, name: 'Male'},
    {id: 2, name: 'Female'}
  ];

  $scope.sliders = {};
  $scope.sliders.rate = [15, 80];

  $scope.rateOptions = {
    min: 15,
    max: 100,
    step: 1
  };


  $scope.locations = [ // Taken from https://gist.github.com/unceus/6501985
    {name: 'Afghanistan', code: 'AF'},
    {name: 'Åland Islands', code: 'AX'},
    {name: 'Albania', code: 'AL'},
    {name: 'Algeria', code: 'DZ'},
    {name: 'American Samoa', code: 'AS'},
    {name: 'Andorra', code: 'AD'},
    {name: 'Angola', code: 'AO'},
    {name: 'Anguilla', code: 'AI'},
    {name: 'Antarctica', code: 'AQ'},
    {name: 'Antigua and Barbuda', code: 'AG'},
    {name: 'Argentina', code: 'AR'},
    {name: 'Armenia', code: 'AM'},
    {name: 'Aruba', code: 'AW'},
    {name: 'Australia', code: 'AU'},
    {name: 'Austria', code: 'AT'},
    {name: 'Azerbaijan', code: 'AZ'},
    {name: 'Bahamas', code: 'BS'},
    {name: 'Bahrain', code: 'BH'},
    {name: 'Bangladesh', code: 'BD'},
    {name: 'Barbados', code: 'BB'},
    {name: 'Belarus', code: 'BY'},
    {name: 'Belgium', code: 'BE'}
];

  $scope.format = function(value) {
    if (!_.isUndefined(value))
    return 'From $' + value[0] + '/hr  to  $' + value[1] + '/hr';
  };

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
    ],
    subjectEditable : false,
    subjects : [

    ]
  };

  $scope.toggleEditable = function(modal) {
    $scope.user[modal] = $scope.user[modal] === false;
    $scope.$broadcast('SetFocus');
  };

  $scope.addOption = function(option, modal) {
    if (_.indexOf($scope.user[modal], option) > -1){
      toastr.error(option.name + ' already exits in the your list', null);
      return
    }

    $scope.user[modal].push(option);
    $scope.locations.selected = null;
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
  
}];