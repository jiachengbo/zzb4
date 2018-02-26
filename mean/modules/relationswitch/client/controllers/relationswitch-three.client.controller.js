(function () {
  'use strict';

  angular
    .module('relationswitch')
    .controller('RelationswitchThreeController', RelationswitchThreeController);

  RelationswitchThreeController.$inject = ['$scope', '$stateParams', '$log', '$window',
    '$state', 'baseCodeService', 'menuService'];
  function RelationswitchThreeController($scope, $stateParams, $log, $window,
                                         $state, baseCodeService, menuService) {
    var vmo = this;
    //获取参数
    var storage = $window.localStorage.getItem('relation1');
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
    vmo.sidemenu = menuService.getMenu('sidemenu');
    var isDYGXZJGL;
    var isStop = true;
    angular.forEach(vmo.sidemenu.items, function (item, index) {
      if (isStop && item.title === '党员关系转接管理') {
        isDYGXZJGL = index;
        isStop = false;
      }
    });
    vmo.bigTitleName = '转入';
    for (var i = 0; i < vmo.sidemenu.items[isDYGXZJGL].items.length; i++) {
      if (vmo.sidemenu.items[isDYGXZJGL].items[i].isSelected) {
        vmo.bigTitleName = vmo.sidemenu.items[isDYGXZJGL].items[i].title;
      }
    }
    var isSelected = false;
    if (vmo.bigTitleName.indexOf('转入') !== -1) {
      isSelected = true;
    }
    //读取本地存储的党委党工委信息
    var partyList1 = baseCodeService.getItems('dj_PartyBranch');
    var _partyList = [];
    if (partyList1.length !== 0) {
      for (var j = 0; j < partyList1.length; j++) {
        if (partyList1[j].generalbranch === vmo.id) {
          _partyList.push(partyList1[j]);
        }
      }
    }
    $scope.columnDefsthree = _partyList;
    vmo.ok = function (str) {
      $scope.$emit('dzbRelInfo', str.simpleName);
      if (isSelected) {
        $state.go('relationswitch.curd.inmain', {tj: str, orgInfo: vmo.orgInfo});
      } else {
        $state.go('relationswitch.curd.outmain', {tj: str, orgInfo: vmo.orgInfo});
      }
    };
  }
}());
