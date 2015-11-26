'use strict';

define(['jquery', 'angular', 'angular-mocks', 'app.module', 'components/tutor/tutors.controller', 'underscore'], function($, angular, mocks, app, controller) {

    describe('TEST_TutorListController', function() {

		var scope;//we'll use this scope in our tests
        var stateParams;

        beforeEach(module('app.tutor', 'ui.router'));

        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            scope.mainQuery = {};
            scope.pagination = {
                pageSize: 10,
                currentPage: 1,
                totalPages: 0,
                pagers: []
            };
            stateParams = { subject: 'math', location: 'melbourne', subjectids: ['1', '2'], geohash: 'r1r0fuh4h', gender: 'male' }//mockup router data
            $controller(controller, {
                $scope: scope,
                $stateParams: stateParams
            });
        }));

        //Test main query been generated correctly
        it('TEST_generateMainQuery', function() {
            scope.generateMainQuery();
            expect(scope.mainQuery.keywords).toBe('math');
            expect(scope.mainQuery.location).toBe('melbourne');
            expect(scope.mainQuery.subjectids).toEqual(['1', '2']);
            expect(scope.mainQuery.geohash).toBe('r1r0fuh4h');
            expect(scope.mainQuery.range).toBe('1km');
            expect(scope.mainQuery.gender).toBe('male');
            expect(scope.mainQuery.page).toBe(1);
            expect(scope.mainQuery.pageSize).toBe(10);
        });

        //Test filterChecked method
        it('TEST_filterChecked', function() {
            expect(scope.filterChecked('gender', 'female')).toBe(false);
			expect(scope.filterChecked('gender', 'male')).toBe(true);
            expect(scope.filterChecked('location', 'r1r0vkvww')).toBe(false);
            expect(scope.filterChecked('location', 'r1r0fuh4h')).toBe(true);
            expect(scope.filterChecked('subject', '3')).toBe(false);
            expect(scope.filterChecked('subject', '2')).toBe(true);
        });

        //Test pager generation - first page
        it('TEST_updatePagination_First_Page', function() {

            //page 1 for record 6049
            scope.updatePagination(1, 6049);

            expect(scope.pagination.currentPage).toBe(1);
            expect(scope.pagination.totalPages).toBe(605);

            expect(scope.pagination.pagers[0].page).toBe(1);
            expect(scope.pagination.pagers[0].type).toBe('first');
            expect(scope.pagination.pagers[0].disabled).toBe(true);

            expect(scope.pagination.pagers[1].page).toBe(0);
            expect(scope.pagination.pagers[1].type).toBe('previous');
            expect(scope.pagination.pagers[1].disabled).toBe(true);

            expect(scope.pagination.pagers[2].page).toBe(1);
            expect(scope.pagination.pagers[2].type).toBe('pager');
            expect(scope.pagination.pagers[2].active).toBe(true);

            expect(scope.pagination.pagers[3].page).toBe(2);
            expect(scope.pagination.pagers[3].type).toBe('pager');
            expect(scope.pagination.pagers[3].active).toBe(false);

            expect(scope.pagination.pagers[7].page).toBe(6);
            expect(scope.pagination.pagers[7].type).toBe('next-pagers');

            expect(scope.pagination.pagers[8].page).toBe(2);
            expect(scope.pagination.pagers[8].type).toBe('next');
            expect(scope.pagination.pagers[8].disabled).toBe(false);

            expect(scope.pagination.pagers[9].page).toBe(605);
            expect(scope.pagination.pagers[9].type).toBe('last');
            expect(scope.pagination.pagers[9].disabled).toBe(false);
        });

        //Test pager generation - medium page
        it('TEST_updatePagination_Medium_Page', function() {

            //page 118 for record 6049
            scope.updatePagination(118, 6049);

            expect(scope.pagination.currentPage).toBe(118);

            expect(scope.pagination.pagers[0].page).toBe(1);
            expect(scope.pagination.pagers[0].type).toBe('first');
            expect(scope.pagination.pagers[0].disabled).toBe(false);

            expect(scope.pagination.pagers[1].page).toBe(117);
            expect(scope.pagination.pagers[1].type).toBe('previous');
            expect(scope.pagination.pagers[1].disabled).toBe(false);

            expect(scope.pagination.pagers[2].page).toBe(115);
            expect(scope.pagination.pagers[2].type).toBe('previous-pagers');

            expect(scope.pagination.pagers[3].page).toBe(116);
            expect(scope.pagination.pagers[3].type).toBe('pager');
            expect(scope.pagination.pagers[3].active).toBe(false);

            expect(scope.pagination.pagers[5].page).toBe(118);
            expect(scope.pagination.pagers[5].type).toBe('pager');
            expect(scope.pagination.pagers[5].active).toBe(true);

            expect(scope.pagination.pagers[8].page).toBe(121);
            expect(scope.pagination.pagers[8].type).toBe('next-pagers');

            expect(scope.pagination.pagers[9].page).toBe(119);
            expect(scope.pagination.pagers[9].type).toBe('next');
            expect(scope.pagination.pagers[9].disabled).toBe(false);

            expect(scope.pagination.pagers[10].page).toBe(605);
            expect(scope.pagination.pagers[10].type).toBe('last');
            expect(scope.pagination.pagers[10].disabled).toBe(false);
        });

        //Test pager generation last page
        it('TEST_updatePagination_Last_Page', function() {
            //page 605 for record 6049
            scope.updatePagination(605, 6049);

            expect(scope.pagination.currentPage).toBe(605);

            expect(scope.pagination.pagers[0].page).toBe(1);
            expect(scope.pagination.pagers[0].type).toBe('first');
            expect(scope.pagination.pagers[0].disabled).toBe(false);

            expect(scope.pagination.pagers[1].page).toBe(604);
            expect(scope.pagination.pagers[1].type).toBe('previous');
            expect(scope.pagination.pagers[1].disabled).toBe(false);

            expect(scope.pagination.pagers[2].page).toBe(600);
            expect(scope.pagination.pagers[2].type).toBe('previous-pagers');

            expect(scope.pagination.pagers[3].page).toBe(601);
            expect(scope.pagination.pagers[3].type).toBe('pager');
            expect(scope.pagination.pagers[3].active).toBe(false);

            expect(scope.pagination.pagers[8].page).toBe(606);
            expect(scope.pagination.pagers[8].type).toBe('next');
            expect(scope.pagination.pagers[8].disabled).toBe(true);

            expect(scope.pagination.pagers[9].page).toBe(605);
            expect(scope.pagination.pagers[9].type).toBe('last');
            expect(scope.pagination.pagers[9].disabled).toBe(true);
        });

        //Test capitalize first letter
        it('TEST_capitalizeFirstLetter', function() {
            expect(scope.capitalizeFirstLetter('hello world')).toBe('Hello world');
            expect(scope.capitalizeFirstLetter('hello world')).not.toBe('Hello World');
        });
    });
});