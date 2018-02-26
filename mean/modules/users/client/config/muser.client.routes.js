(function () {
  'use strict';

  angular
    .module('muser.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.muser', {
        //abstract: true,
        url: '/muser',
        templateUrl: '/modules/users/client/views/admin/muser.client.view.html',
        controller: 'MUserController',
        controllerAs: 'vm',
        resolve: {
          departmentResolve: getDepartments,
          workpositionResolve: getWorkPositions,
          muserResolve: getMUsers
        },
        data: {
          pageTitle: '用户管理'
        }
      })
      .state('admin.muser.grid', {
        //url: undefined, //限制不能通过浏览器地址栏进入此路由
        templateUrl: '/modules/users/client/views/admin/muser-grid.client.view.html',
        controller: 'MUserGridController',
        controllerAs: 'vm',
        params: {
          //部门下的所有人员数组
          muser_rows: null
        },
        data: {
          pageTitle: '用户列表'
        }
      })
      .state('admin.muser.edit', {
        templateUrl: '/modules/users/client/views/admin/muser-edit.client.view.html',
        controller: 'MUserEditController',
        controllerAs: 'vm',
        params: {
          isupdate: 0,
          //当前行变量
          muser_row: null,
          //进行的操作
          muser_rowop: null,
          //岗位表所有数据
          workposition_rows: null,
          //部门表所有数据
          department_rows: null,
          //当前部门数据
          value: null
        },
        data: {
          pageTitle: '用户详情'
        }
      });

    getDepartments.$inject = ['DepartmentService', '$window'];
    function getDepartments(DepartmentService, $window) {
      return DepartmentService.query().$promise
        .catch(function (error) {
          $window.alert('getDepartments error');
          throw error;
        });
    }
    getWorkPositions.$inject = ['WorkPositionService', '$window'];
    function getWorkPositions(WorkPositionService, $window) {
      return WorkPositionService.query().$promise
        .catch(function (error) {
          $window.alert('getWorkPositions error');
          throw error;
        });
    }
    getMUsers.$inject = ['AdminService', '$window', 'appService', 'baseCodeService'];
    function getMUsers(AdminService, $window, appService, baseCodeService) {
      //console.log(appService.user, dj_PartyBranch);
      return AdminService.query().$promise
        .catch(function (error) {
          $window.alert('getMUsers error');
          throw error;
        });
    }
  }
}());
