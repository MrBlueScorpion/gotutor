'use strict';

module.exports = ['$scope', 'TutorApiService', '$state',
  function ($scope, TutorApiService, $state) {

    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocations = function (location) {
      return TutorApiService.getLocations(location).then(function (locations) {
        return locations;
      })
    };

    $scope.getSubjects = function (subject) {
      return TutorApiService.getSubjects(subject).then(function (subjects) {
        return subjects
      })
    };

    var cleanseQuery = function(s) {
      return _.filter(s.replace(/[^\w]+/g, ' ').split(' '), function(x) {return x;}).join('-').toLowerCase();
    };

    $scope.searchTutors = function () {
      var query = [];

      if (angular.isDefined($scope.subject)) {
        if (angular.isObject($scope.subject)) {
          query.push(cleanseQuery($scope.subject.text + '-s' + $scope.subject.id));
        } else {
          query.push(cleanseQuery("s-" + $scope.subject));
        }
      }

      if (angular.isDefined($scope.location)) {
        if (angular.isObject($scope.location)) {
          query.push(cleanseQuery($scope.location.text + '-l' + $scope.location.id));
        } else {
          query.push(cleanseQuery("l-" + $scope.location));
        }
      }

      switch (query.length) {
        case 0: return $state.go('tutors');
        case 1: return $state.go('tutors-param1', { param1: query[0] });
        case 2: return $state.go('tutors-param2', { param1: query[0], param2: query[1] });
      }
      $state.go('tutors-param2', {
        param1: 'a-s6',
        param2: 'b-l46'
      });
    };

    TutorApiService.getRecommendedTutors().then(function (recommendedTutors) {
      $scope.recommendedTutors = recommendedTutors;
    });

  }];
