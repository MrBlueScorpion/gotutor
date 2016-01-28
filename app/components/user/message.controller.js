'use strict';

module.exports = ['$scope', 'TutorApiService', 'toastr', function($scope, TutorApiService, toastr) {
  $scope.messages = [];
  TutorApiService.getMessages().then(function(response) {
    console.log(response);
    $scope.messages = response;
  });

  $scope.pagination = {
    //numPages : 0,
    //itemsPerPageLimits : [10, 25, 50, 75, 100],
    itemsPerPage : 10,
    totalItems : $scope.messages.length,
    maxSize : 5,
    currentPage : 1,
    goToPage : function(page) {
      $scope.pagination.currentPage = page;
      $scope.checkStatus();
    }
  };


  $scope.checkStatus = function () {
    $scope.checkedMessages = $scope.getPagedResults().filter(function(message) {
      return message.checked;
    });
    $scope.allChecked = ($scope.checkedMessages.length == $scope.getPagedResults().length);
  };

  $scope.checkAll = function (check) {
    $scope.getPagedResults().forEach(function(message) {
      message.checked = !check;
    })
  };

  $scope.getPagedResults = function() {
    var start = ($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage;
    var end = start + $scope.pagination.itemsPerPage;
    return $scope.messages.slice(start, end);
  };

  $scope.deleteMessages = function() {
    var messageIds = _.map($scope.checkedMessages, function(message) {
      return message._id;
    });
    TutorApiService.deleteMessages(messageIds).then(function(response) {
      $scope.messages = _.difference($scope.messages, $scope.checkedMessages);
      if(!_.isUndefined(response.success)) {
        toastr.success(response.success)
      }
    });
  }

}];