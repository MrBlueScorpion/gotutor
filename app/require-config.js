require.config({
    paths: {
        angular: 'bower_components/angular/angular',
        angularRoute: 'bower_components/angular-route/angular-route',
        angularMocks: 'bower_components/angular-mocks/angular-mocks',
        angularUiRouter: 'bower_components/angular-ui-router/release/angular-ui-router'
       // text: 'bower_components/requirejs-text/text'
    },
    shim: {
        'angular' : {'exports' : 'angular'},
        'angularRoute': ['angular'],
        'angularMocks': {
            deps:['angular'],
            'exports':'angular.mock'
        }
    },
    priority: [
        "angular"
    ],
    deps: ['app.main'],
    baseUrl: '.'
});

require(['app.main'], function(app){
    app.init();
});