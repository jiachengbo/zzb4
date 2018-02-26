(function () {
  'use strict';

  angular
    .module('partyorganization')
    .controller('PartyorganizationDWController', PartyorganizationDWController);

  PartyorganizationDWController.$inject = ['$scope', '$log', '$window', '$state', 'baseCodeService', '$stateParams'];
  function PartyorganizationDWController($scope, $log, $window, $state, baseCodeService, $stateParams) {
    var vmo = this;
    //读取本地存储的党委党工委信息
    var partyList = baseCodeService.getItems('dj_PartyOrganization');
    $scope.columnDefsone = partyList;
    vmo.ok = function (str) {
      //子控制器向父控制器传递数据
      $scope.$emit('dwOrgInfo', str.typeName);
      $state.go('partyorganization.curd.main', {typeid: str.typeID, typename: str.typeName, type: $stateParams.type});
    };
  }
}());
