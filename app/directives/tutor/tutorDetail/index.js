'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            tutor: '&'
        },
        replace: true,
        templateUrl: "directives/tutor/tutorDetail/index.html",
        link: function(scope) {
            scope.tutor = scope.tutor();
        }
    };
};
