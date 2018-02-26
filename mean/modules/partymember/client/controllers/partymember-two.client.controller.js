(function () {
  'use strict';

  angular
    .module('partymember')
    .controller('PartymemberTwoController', PartymemberTwoController);

  PartymemberTwoController.$inject = ['$scope', '$log', '$state', '$stateParams', 'baseCodeService'];
  function PartymemberTwoController($scope, $log, $state, $stateParams, baseCodeService) {
    var vmo = this;
    //获取参数
    vmo.id = $stateParams.typeid;
    vmo.name = $stateParams.typename;
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
      $scope.$emit('dzzInfo', str.simpleName);
      if (str.isShow) {
        $state.go('partymember.curd.main', {tj: str, orgInfo: orgstr});
      } else {
        $state.go('partymember.curd.three', {tj: str.branchID, orgInfo: orgstr});
      }
    };
  }
}());
