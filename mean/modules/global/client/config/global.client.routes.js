(function () {
  'use strict';

  angular
    .module('global.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function routeConfig($stateProvider, $urlRouterProvider) {
    var welcomeState = {
      sjgl: {imgName: '1', pageTitle: '莲湖区数据管理信息系统'},
      dlxx: {imgName: '2', pageTitle: '莲湖区地理信息管理系统'},
      szcg: {imgName: '3', pageTitle: '莲湖区数字化平台系统'},
      wgh: {imgName: '4', pageTitle: '莲湖区网格化管理系统'},
      sphy: {imgName: '5', pageTitle: '莲湖区视频会议系统软件'},
      spjk: {imgName: '6', pageTitle: '莲湖区视频监控系统'},
      gzfw: {imgName: '7', pageTitle: '莲湖区公众服务系统'},
      yjzh: {imgName: '8', pageTitle: '莲湖区应急指挥调度系统'}
    };

    //防止重复注册home
    if ($stateProvider.stateService.get('home')) {
      $stateProvider.stateRegistry.deregister('home');
    }
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/modules/global/client/views/home.client.view.html',
        controller: 'homeWelcomeController',
        controllerAs: 'vm',
        data: {
          pageTitle: '首页'
        }
      })
      .state('jccsdj', {
        url: '/jccsdj',
        templateUrl: '/modules/global/client/views/jccsdj.client.view.html',
        controller: 'jccsdjController',
        controllerAs: 'vm',
        data: {
          pageTitle: '基层城市党建'
        }
      })
      .state('jcxxgl', {
        url: '/jcxxgl',
        templateUrl: '/modules/global/client/views/jcxxgl.client.view.html',
        controller: 'jcxxglController',
        controllerAs: 'vm',
        data: {
          pageTitle: '基础信息管理'
        }
      });

    for (var stateName in welcomeState) {
      var data = welcomeState[stateName];
      $stateProvider
        .state(stateName, {
          url: '/' + stateName,
          templateUrl: '/modules/global/client/views/child-welcome.client.view.html',
          controller: 'ChildWelcomeController',
          controllerAs: 'vm',
          data: angular.extend({roles: ['user']}, data)
        });
    }
  }
}());
