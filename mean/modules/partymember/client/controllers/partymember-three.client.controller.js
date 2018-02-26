(function () {
  'use strict';

  angular
    .module('partymember')
    .controller('PartymemberThreeController', PartymemberThreeController);

  PartymemberThreeController.$inject = ['$scope', '$log', '$state', '$stateParams', 'baseCodeService', '$window'];
  function PartymemberThreeController($scope, $log, $state, $stateParams, baseCodeService, $window) {
    var vmo = this;
    //获取参数
    var storage = $window.localStorage.getItem('Orgtj11');
    var storagedata = JSON.parse(storage);
    console.log(storagedata);
    if (storage === '{}') {
      vmo.id = $stateParams.tj;
      vmo.orgInfo = $stateParams.orgInfo;
    } else {
      vmo.id = storagedata.id;
      vmo.orgInfo = storagedata.orgInfo;
    }
    /*vmo.id = $stateParams.tj;
    vmo.orgInfo = $stateParams.orgInfo;*/
    //读取本地存储的党委党工委信息
    var partyList1 = baseCodeService.getItems('dj_PartyBranch');
    var _partyList = [];
    if (partyList1.length !== 0) {
      for (var i = 0; i < partyList1.length; i++) {
        if (partyList1[i].generalbranch === vmo.id) {
          _partyList.push(partyList1[i]);
        }
      }
    }
    $scope.columnDefsthree = _partyList;
    vmo.ok = function (str) {
      $scope.$emit('dzbInfo', str.simpleName);
      $state.go('partymember.curd.main', {tj: str, orgInfo: vmo.orgInfo});
    };
  }
}());
