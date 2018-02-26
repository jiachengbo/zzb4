(function () {
  'use strict';

  angular
    .module('workposition.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.workposition', {
        //abstract: true,
        url: '/workposition',
        templateUrl: '/modules/users/client/views/admin/workposition.client.view.html',
        controller: 'WorkPositionController',
        controllerAs: 'vm',
        resolve: {
          departmentResolve: getDepartments,
          workpositionResolve: getWorkPositions,
          roleResolve: getRoles
        },
        data: {
          pageTitle: '工作岗位'
        }
      })
      .state('admin.workposition.grid', {
        //url: undefined, //限制不能通过浏览器地址栏进入此路由
        templateUrl: '/modules/users/client/views/admin/workposition-grid.client.view.html',
        controller: 'WorkPositionGridController',
        controllerAs: 'vm',
        params: {
          //部门下的所有岗位数组
          position_rows: null
        },
        data: {
          pageTitle: '岗位列表'
        }
      })
      .state('admin.workposition.edit', {
        templateUrl: '/modules/users/client/views/admin/workposition-edit.client.view.html',
        controller: 'WorkPositionEditController',
        controllerAs: 'vm',
        params: {
          //当前行变量
          position_row: null,
          //进行的操作
          position_rowop: null,
          //权限表所有数据
          role_rows: null
        },
        data: {
          pageTitle: '岗位详情'
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
    getRoles.$inject = ['RoleService', '$window'];
    function getRoles(RoleService, $window) {
      return RoleService.query().$promise
        .catch(function (error) {
          $window.alert('getRoles error');
          throw error;
        });
    }

    /*
        isCanin.$inject = ['$stateParams', '$state', 'Notification', '$q'];
        function isCanin($stateParams, $state, Notification, $q) {
          var deferred = $q.defer();
          if (!$stateParams.position_rows) {
            Notification.error({ message: '进入错误', title: '<i class="glyphicon glyphicon-remove"></i> 请从菜单进入!' });
            return defeered.promise;
          } else {
            console.log('2222');
            return deferred.resolve();
          }
        }
    */
  }
}());
