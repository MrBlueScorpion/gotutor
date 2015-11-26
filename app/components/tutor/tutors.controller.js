'use strict';

define(function(require) {

  return ['$scope', '$stateParams', '$state', 'TutorApiService', function ($scope, $stateParams, $state, TutorApiService) {
    //Init function
    function init() {
      //show loading mask
      $scope.showLoader(true);
      //show error
      $scope.showError = false;
      //Filter data source
      $scope.filters = null;
      //Searching results
      $scope.tutors = [];
      $scope.totalCount = 0;
      //This is the query from url
      $scope.mainQuery = {};
      //This is the query from filter
      //$scope.filterQuery = {};
      //pagination
      $scope.pagination = {
        pageSize: 10,
        currentPage: 1,
        totalPages: 0,
        pagers: []
      };
      //generate main query
      $scope.generateMainQuery();
      //search and display
      searchAndDisplay();
    }

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
    }

    //Generate main query obj
    $scope.generateMainQuery = function () {
      //console.log($stateParams);
      if ($stateParams) {
        $scope.mainQuery.keywords = $stateParams.subject ? $stateParams.subject : '';
        $scope.mainQuery.location = $stateParams.location ? $stateParams.location : '';
        $scope.mainQuery.subjectids = ($stateParams.subjectids && $stateParams.subjectids.length > 0) ? $stateParams.subjectids : [];
        $scope.mainQuery.geohash = $stateParams.geohash ? $stateParams.geohash : '';
        $scope.mainQuery.range = '1km';
        $scope.mainQuery.gender = $stateParams.gender ? $stateParams.gender : '';
        var page = parseInt($stateParams.page);
        $scope.mainQuery.page = (page && page > 0) ? page : 1;
        $scope.mainQuery.pageSize = $scope.pagination.pageSize;
      }
      //console.log($scope.mainQuery);
    }

    //search and display
    function searchAndDisplay() {
      TutorApiService.getTutorsByQuery($scope.mainQuery)
      .then(function(data){
        if (data && data.hits > 0 && data.results && data.results.length > 0 && data.facet) {
          //got results
          //console.log(data);
          //display tutor list
          $scope.tutors = data.results;
          $scope.totalCount = data.hits;
          //display filter
          $scope.filters = data.facet;
          //generage pagination
          $scope.updatePagination($scope.mainQuery.page, $scope.totalCount);
        } else {
          //panic
          //console.log(data);
          //display error message
          $scope.showError = true;
        }
      }).catch(function(e){
        //console.log(e);
        $scope.showError = true;
      }).finally(function(){
        //hide loading mask
        $scope.showLoader(false);
      });
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
    }

    //capitalize
    $scope.capitalizeFirstLetter = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    //show/hide loader
    $scope.showLoader = function (show) {
      if (show) {
        $('#status').show();
        $('#preloader').show();
      } else {
        $('#status').fadeOut();
        $('#preloader').fadeOut(200);
      }
    };

    //Start here
    init();
  }];

});
