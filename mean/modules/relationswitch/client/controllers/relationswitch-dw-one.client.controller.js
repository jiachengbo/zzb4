(function () {
  'use strict';

  angular
    .module('relationswitch')
    .controller('RelationswitchDWOneController', RelationswitchDWOneController);

  RelationswitchDWOneController.$inject = ['$scope', '$state', '$log', '$window',
    'baseCodeService', 'appService'];
  function RelationswitchDWOneController($scope, $state, $log, $window, baseCodeService, appService) {
    var vmo = this;
    //读取本地存储的党委党工委信息
    var partyList = baseCodeService.getItems('dj_PartyOrganization');
    var PartyBranch = baseCodeService.getItems('dj_PartyBranch');
    if (appService.user) {
      if (appService.user.user_grade === 5 || appService.user.user_grade === 4) {
        angular.forEach(PartyBranch, function (value, key) {
          if (value.OrganizationId === appService.user.branch) {
            var obj = value;
            vmo.arr = [];
            angular.forEach(partyList, function (v, i) {
              if (obj.super === v.typeID) {
                this.push(v);
              }
            }, vmo.arr);
          }
        });
        $scope.columnDefsone = vmo.arr;
      } else {
        $scope.columnDefsone = partyList;
      }
      vmo.ok = function (str) {
        $log.info(str.typeName);
        $log.info(str.typeID);
        $scope.$emit('dwRelInfo', str.typeName);
        $state.go('relationswitch.curd.two', {typeid: str.typeID, typename: str.typeName});
      };
    }

    /*$scope.columnDefsone = partyList;
     vmo.ok = function (str) {
     //子控制器向父控制器传递数据
     $scope.$emit('dwRelInfo', str.typeName);
     $state.go('relationswitch.curd.two', {typeid: str.typeID, typename: str.typeName});
     };*/
  }
}());
