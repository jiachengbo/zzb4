(function () {
  'use strict';

  angular
    .module('survey.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('survey', {
        abstract: true,
        url: '/survey',
        template: '<ui-view/>'
      })
      .state('survey.curd', {
        url: '/curd',
        templateUrl: '/modules/survey/client/views/survey-curdtable.client.view.html',
        controller: 'SurveyCURDTableController',
        controllerAs: 'vm',
        data: {
          pageTitle: '概况'
        }
      });
  }
}());
