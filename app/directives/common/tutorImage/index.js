'use strict';

module.exports = function() {
    return {
        restrict: 'E',
        scope: {
            gender: '@',
            image: '@',
            tutorId: "@"
        },
        templateUrl: "directives/common/tutorImage/index.html"
    };
};
