'use strict';

define(function(require) {

  return ['$scope', function($scope) {
    $scope.messages = [
      {
        content : 'is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@hotmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@hotmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@hotmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'is distracted by the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@hotmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'is a long established facted by the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@hotmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'is a long established by the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@hotmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'is a long established fact t',
        sentDate : '01/01/2014'
      },
      {
        content : 'is a long established fact that a reader e readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@gmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : ' by the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@gmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'e readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@gmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : ' the readable content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@gmail.com',
        sentDate : '01/01/2014'
      },
      {
        content : 'e content of a page when looking at its layout. The point of using',
        sender : 'zlxjackie@gmail.com',
        sentDate : '01/01/2014'
      }

    ];

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

  }]
});