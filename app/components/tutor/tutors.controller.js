'use strict';
module.exports = ['$scope', '$stateParams', '$state', 'TutorApiService', 'toastr', function ($scope, $stateParams, $state, TutorApiService, toastr) {

  var FilterEnum = {
      SUBJECT: 10,
      SUBJECT_IDS: 20,
      LOCATION: 30,
      GEOHASH: 40,
      GENDER: 50
    };

  //Depends one filter type and value, set check box checked or not
  $scope.filterChecked = function(filterType, value){
    var checked = false;
    switch (filterType) {
      case 'gender':
        checked = $stateParams.gender == value;
        break;
      case 'location':
        checked = $stateParams.geohash == value;
        break;
      case 'subject':
        value += '';
        //only one subjectids, it is a string
        if (typeof $stateParams.subjectids === 'string') {
          checked = $stateParams.subjectids === value;
        } else {//otherwise it is a array
          checked = _.includes($stateParams.subjectids, value);
        }
        break;
      default:
        break;
    }
    return checked;
  };

  //Apply/remove filter
  $scope.applyFilter = function (event, filterType, value) {
    //event.preventDefault();
    var checked = event.currentTarget.checked;//this state is what happened when clicks a check box, e.g. If was checked, now is unchecked.
    //console.log(checked);
    //apply / remove filter
    var currentStateParams = angular.copy($stateParams);
    currentStateParams.page = 1;
    switch (filterType) {
      case 'gender':
        if (checked) {
          currentStateParams.gender = value;
        } else {
          currentStateParams.gender = null;
        }
        break;
      case 'location':
        if (value) {//if no geohash, do nothing, I will remove them from filter view
          if (checked) {
            currentStateParams.geohash = value;
          } else {
            currentStateParams.geohash = null;
          }
        } else {
          return;
        }
        break;
      case 'subject':
        if (typeof currentStateParams.subjectids === 'undefined') {
          //add to params
          if (checked) {
            currentStateParams.subjectids = '' + value;
          }
        } else if (typeof currentStateParams.subjectids === 'string') {
          if (checked) {
            //convert to array
            var currentSubjectids = currentStateParams.subjectids;
            currentStateParams.subjectids = [currentSubjectids, '' + value];
          } else {
            //remove
            currentStateParams.subjectids = null;
          }
        } else {
          //is a array
          if (checked) {
            currentStateParams.subjectids.push('' + value);
          } else {
            currentStateParams.subjectids = _.reject(currentStateParams.subjectids, function(id){
              return id == '' + value;
            });
          }
        }
        break;
      default:
        break;
    }
    //console.log(currentStateParams);
    //go!!!
    $state.go('tutors', currentStateParams);
  };

  var subjectIdRegex = /-s(\d+)$/, keywordRegex = /^s-(.+)$/, locationRegex = /^l-(.+)$/, locationIdRegex = /-l(\d+)$/;

  var parseQueryParams = function() {
    var ret = {};
    _.forEach(arguments, function(x) {
      if (!x) return;
      var match;
      if (match = x.match(subjectIdRegex)) {
        ret.subjectids = match[1];
      } else if (match = x.match(locationIdRegex)) {
        ret.locationid = match[1]
      } else if (match = x.match(keywordRegex)) {
        ret.keywords = match[1]
      } else if (match = x.match(locationRegex)) {
        ret.location = match[1]
      }
    });
    return ret;
  }

  //search and display
  function searchAndDisplay() {
    TutorApiService.getTutorsByQuery($scope.mainQuery)
    .then(function(data){
      if (data && data.hits > 0 && data.results && data.results.length > 0) {
        $scope.tutors = data.results;
        $scope.totalCount = data.hits;
        //display filter
        // $scope.filters = data.facet;
        // //add genders if not
        // if ($scope.filters.gender && $scope.filters.gender.length == 0) {
        //   $scope.filters.gender.push({ key: "female" });
        //   $scope.filters.gender.push({ key: "male" });
        // }
        //get facet
        //$scope.facet = data.facet;
        //generate pagination
        $scope.updatePagination($scope.mainQuery.page, $scope.totalCount);
        //generate filters
        $scope.generateFilterAlt();
      } else {
        //panic
        //console.log(data);
        //display error message
        $scope.showError = true;
      }
    }).catch(function(e){
      $scope.showError = true;
    }).finally(showLoader);
  };

    //generate alternative filters
    $scope.generateFilterAlt = function () {
      // TODO Rewrite this function
      
      //keywords or subject
      if ($stateParams.subjectids) {//using subject
        if (typeof $stateParams.subjectids === 'string') {//single id
          (function () {
            var subjectId = parseInt($stateParams.subjectids);
            if (subjectId > 0) {
              var subject = $stateParams.keywords;
              if (subject) {
                $scope.filtersAlt.push({ type: FilterEnum.SUBJECT_IDS, key: subjectId, text: subject });
              }
            }
          }())
        } else {//id array
          $stateParams.subjectids.forEach(function(ele) {
            var subjectId = parseInt(ele);
            if (subjectId > 0) {
              var subject = getSubjectById($scope.facet, subjectId);
              if (subject) {
                $scope.filtersAlt.push({ type: FilterEnum.SUBJECT_IDS, key: subjectId, text: subject.subject });
              }
            }
          });
        }
      } else if ($stateParams.subject) {//using subject string
        $scope.filtersAlt.push({ type: FilterEnum.SUBJECT, key: $stateParams.subject, text: $stateParams.subject });
      }
      //location or geohash
      if ($stateParams.geohash) {//using geohash
        (function () {
          var location = getLocationByGeohash($scope.facet, $stateParams.geohash);
          if (location) {
            $scope.filtersAlt.push({ type: FilterEnum.GEOHASH, key: $stateParams.geohash, text: location.suburb });
          }
        }())
      } else if ($stateParams.location) {//using location string
        $scope.filtersAlt.push({ type: FilterEnum.LOCATION, key: $stateParams.location, text: $stateParams.location });
      }
      //gender
      //console.log($scope.filtersAlt);
    };

    //remove alternative filter
    $scope.removeFiltersAlt = function (filter) {
      var currentStateParams = angular.copy($stateParams);
      if (filter) {
        switch (filter.type) {
          case FilterEnum.SUBJECT:
            currentStateParams.subject = null;
            break;
          case FilterEnum.SUBJECT_IDS:
            if (typeof currentStateParams.subjectids === 'string') {//is a string
              currentStateParams.subjectids = null;
              currentStateParams.subject = null;
            } else {//is a array
              currentStateParams.subjectids = _.reject(currentStateParams.subjectids, function(id){
                return id == '' + filter.key;
              });
            }
            break;
          case FilterEnum.LOCATION:
            currentStateParams.location = null;
            break;
          case FilterEnum.GEOHASH:
            currentStateParams.geohash = null;
            break;
          default:
            break;
        }
      }
      //console.log(currentStateParams);
      //go!!!
      $state.go('tutors', currentStateParams);
    };

    //get subject by id from filter
    function getSubjectById(facet, id) {
      var subject;
      if (facet.subject) {
        subject = _.find(facet.subject, function(subject){
          return subject.id == id;
        });
      }
      return subject;
    }

    //get location by geohash from filter
    function getLocationByGeohash(facet, geohash) {
      var location;
      if (facet.location) {
        location = _.find(facet.location, function(location) {
          return location.geohash == geohash;
        });
      }
      return location;
    }

    //generate pagination obj
    $scope.updatePagination = function (currentPage, totalCount) {
      if (totalCount > 0) {
        //update total pages
        $scope.pagination.totalPages = Math.ceil(totalCount / $scope.pagination.pageSize);
        //update current page, 1 based
        $scope.pagination.currentPage = currentPage;
        //update pagers array
        var maxDisplayPagers = 5;
        //first page
        $scope.pagination.pagers.push({
          type: 'first',
          disabled: $scope.pagination.currentPage == 1,
          page: 1
        });
        //previous page
        $scope.pagination.pagers.push({
          type: 'previous',
          disabled: $scope.pagination.currentPage == 1,
          page: $scope.pagination.currentPage - 1
        });
        //previous page for pagers
        if ($scope.pagination.currentPage > maxDisplayPagers) {
          $scope.pagination.pagers.push({
            type: 'previous-pagers',
            page: (Math.ceil($scope.pagination.currentPage / maxDisplayPagers) - 1) * 5
          });
        }
        //pagers
        for (var index = 0; index < maxDisplayPagers; index++) {
          var page = ((Math.ceil($scope.pagination.currentPage / maxDisplayPagers) - 1) * 5) + 1 + index;
          if (page <= $scope.pagination.totalPages) {
            $scope.pagination.pagers.push({
              type: 'pager',
              active: page == $scope.pagination.currentPage,
              page: page
            });
          }
        }
        //next page for pagers
        if (Math.ceil($scope.pagination.currentPage / maxDisplayPagers) < Math.ceil($scope.pagination.totalPages / maxDisplayPagers)) {
          $scope.pagination.pagers.push({
            type: 'next-pagers',
            page: (Math.ceil($scope.pagination.currentPage / maxDisplayPagers) * 5) + 1
          });
        }
        //next page
        $scope.pagination.pagers.push({
          type: 'next',
          disabled: $scope.pagination.currentPage == $scope.pagination.totalPages,
          page: $scope.pagination.currentPage + 1
        });
        //last page
        $scope.pagination.pagers.push({
          type: 'last',
          disabled: $scope.pagination.currentPage == $scope.pagination.totalPages,
          page: $scope.pagination.totalPages
        });
      }
      //console.log($scope.pagination);
    };

  //capitalize
  $scope.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //show/hide loader
  var showLoader = function (show) {
    if (show) {
      $('#status').show();
      $('#preloader').show();
    } else {
      $('#status').hide();
      $('#preloader').hide();
    }
  };

  showLoader(true);
  //show error
  $scope.showError = false;
  //Filter data source
  //$scope.filters = null;
  $scope.filtersAlt = [];
  $scope.facet = null;
  //Searching results
  $scope.tutors = [];
  $scope.totalCount = 0;
  //This is the query from filter
  //$scope.filterQuery = {};
  //pagination
  $scope.pagination = {
    pageSize: 20,
    currentPage: 1,
    totalPages: 0,
    pagers: []
  };
  //generate main query
  $scope.mainQuery = parseQueryParams($stateParams.param1, $stateParams.param2, $stateParams.param3);
  $scope.mainQuery.page = $stateParams.page || 1;
  //search and display
  searchAndDisplay();
}];