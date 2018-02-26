(function () {
  'use strict';

  angular
    .module('relationswitch')
    .controller('RelationswitchTwoController', RelationswitchTwoController);

  RelationswitchTwoController.$inject = ['$scope', '$state', '$log', '$window',
    '$stateParams', 'baseCodeService', 'menuService'];
  function RelationswitchTwoController($scope, $state, $log, $window,
                                       $stateParams, baseCodeService, menuService) {
    var vmo = this;
    //获取参数
    vmo.id = $stateParams.typeid;
    vmo.name = $stateParams.typename;
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
    for (var k = 0; k < vmo.sidemenu.items[isDYGXZJGL].items.length; k++) {
      if (vmo.sidemenu.items[isDYGXZJGL].items[k].isSelected) {
        vmo.bigTitleName = vmo.sidemenu.items[isDYGXZJGL].items[k].title;
      }
    }
    var isSelected = false;
    if (vmo.bigTitleName.indexOf('转入') !== -1) {
      isSelected = true;
    }
    //读取本地存储的党委党工委信息
    var partyList1 = baseCodeService.getItems('dj_PartyGeneralBranch');
    var partyList2 = baseCodeService.getItems('dj_PartyBranch');
    var _partyList = [];
    if (partyList1.length !== 0) {
      for (var i = 0; i < partyList1.length; i++) {
        if (partyList1[i].superior === vmo.id) {
          partyList1[i].isShow = false;
          _partyList.push(partyList1[i]);
        }
      }
    }
    if (partyList2.length !== 0) {
      for (var j = 0; j < partyList2.length; j++) {
        if (partyList2[j].super === vmo.id && partyList2[j].generalbranch === null) {
          partyList2[j].isShow = true;
          _partyList.push(partyList2[j]);
        }
      }
    }
    $scope.columnDefstwo = _partyList;
    vmo.ok = function (str) {
      var orgstr = [{'orgid': vmo.id, 'orgname': vmo.name}];
      $scope.$emit('dzzRelInfo', str.simpleName);
      if (str.isShow) {
        if (isSelected) {
          $state.go('relationswitch.curd.inmain', {tj: str, orgInfo: orgstr});
        } else {
          $state.go('relationswitch.curd.outmain', {tj: str, orgInfo: orgstr});
        }
      } else {
        $state.go('relationswitch.curd.three', {tj: str.branchID, orgInfo: orgstr});
      }
    };
  }
}());
