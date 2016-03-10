'use strict';

module.exports = function() {
    return {
        restrict: 'A',
        scope: {
            gtAction: '&'
        },
        link: function (scope, elem) {
            elem.bind('click', function() {
                elem.prop('disabled',true);
                scope.gtAction().finally(function() {
                    elem.prop('disabled',false);
                })
            });
        }
    };
};
