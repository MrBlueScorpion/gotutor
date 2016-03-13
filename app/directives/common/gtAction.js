'use strict';

module.exports = function() {
    return {
        restrict: 'A',
        scope: {
            gtAction: '&',
            gtActionMode: '@'
        },
        link: function (scope, elem) {
            var mode = scope.gtActionMode;
            elem.bind('click', function() {
                if (mode == 'hide') {
                    elem.hide()
                } else {
                    elem.prop('disabled',true);
                }
                scope.gtAction().catch(function () {
                    if (mode == 'hide') {
                        elem.show();
                    }
                }).
                finally(function() {
                    if (mode != 'hide') {
                        elem.prop('disabled',false);
                    }
                })
            });
        }
    };
};
