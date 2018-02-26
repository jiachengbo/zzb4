(function () {
  'use strict';
  /**************************************************************************************
   *公用函数定义
   **************************************************************************************/
  angular
    .module('core')
    .factory('utilService', utilService);

  utilService.$inject = ['$q', '$rootScope', '$window', '$timeout', '$state', '$log',
    '$uibModal', '$resource'];

  function utilService($q, $rootScope, $window, $timeout, $state, $log,
                       $uibModal, $resource) {
    var service = {
      openSearch: function (fieldGroups, dlgTitle) {
        return $uibModal.open({
          template:
            '<div class="modal-header">' +
            ' <h3>{{vm.dlgTitle}}</h3>' +
            '</div>' +
            '<div class="row modal-body">' +
            ' <advanced-searchbox search-api="vm.searchApi" search-params="vm.fieldGroups"></advanced-searchbox>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default"  ng-click="vm.dismiss()">取消</button>' +
            '<button type="button" class="btn btn-primary" ng-click="vm.submit()">提交</button>' +
            '</div>',

          controller: ['$uibModalInstance', function ($uibModalInstance) {
            this.fieldGroups = fieldGroups;
            this.dlgTitle = dlgTitle || '数据查询';
            //关闭
            this.dismiss = function () {
              $uibModalInstance.dismiss('取消');
            };
            //提交
            this.submit = function () {
              var where = this.searchApi.getWhere();
              $uibModalInstance.close(where);
            };
          }],
          controllerAs: 'vm',
          backdrop: 'static',
          size: 'lg',
          windowClass: 'modal-search'
        }).result;
      },
      sendMessage: function (msg) {
        var HttpMessage = $resource('/http-message', null, {
          put: {
            method: 'PUT'
          }
        });
        return HttpMessage.put(msg).$promise;
      }
    };

    return service;
  }
}());
