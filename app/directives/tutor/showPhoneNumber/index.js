'use strict';

module.exports = ['TutorApiService', 'toastr', function(TutorApiService, toastr) {
    return {
        restrict: 'E',
        scope: {
            tutorId: '@'
        },
        templateUrl: "directives/tutor/showPhoneNumber/index.html",
        link: function (scope, elem) {
            scope.showPhoneNumber = function() {
                return TutorApiService
                    .getTutorPhone(scope.tutorId)
                    .catch(function(e) { toastr.error(e); })
                    .then(function(phone) {
                        scope.phone = phone;
                    })
            };
        }
    };
}];
