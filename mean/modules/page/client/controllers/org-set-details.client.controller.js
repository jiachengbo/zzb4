(function () {
  'use strict';

  angular
    .module('page')
    .controller('OrgSetDetailsController', OrgSetDetailsController);

  OrgSetDetailsController.$inject = ['$scope', '$rootScope', '$log', '$window', 'baseCodeService', '$location', 'menuService', '$stateParams', '$anchorScroll', 'cityorgsetService', '$timeout', 'appService', '$state'];
  function OrgSetDetailsController($scope, $rootScope, $log, $window, baseCodeService, $location, menuService, $stateParams, $anchorScroll, cityorgsetService, $timeout, appService, $state) {
    var vm = this;
    vm.show = false;
    vm.orgId = $window.parseInt($location.search().orgId);
    vm.street = $location.search().street ? $window.parseInt($location.search().street) : '';
    vm.partyid = $window.parseInt($location.search().partyid);
    if ($location.search().commun) {
      vm.commun = $location.search().commun;
    } else if ((vm.orgId < 4) && !($location.search().commun)) {
      vm.commun = '';
    } else if ((vm.orgId > 4) && !($location.search().commun)) {
      vm.commun = '0';
    }
    //vm.commun = $location.search().commun ? $location.search().commun : vm.orgId < 4 ? '' : '0';
    if (vm.street) {
      if (vm.commun !== '0') {
        vm.streetperson = {
          name: '社区委员',
          name1: '社区兼职委员',
          show: true
        };
      } else {
        vm.streetperson = {
          name: '街道委员',
          name1: '街道兼职委员',
          show: true
        };
      }
    }
    if (vm.orgId === 2) {
      vm.dutyname1 = '召集人';
      vm.dutyname2 = '副召集人';
      vm.showss = true;
    } else if (vm.orgId === 1) {
      vm.dutyname1 = '组长';
      vm.dutyname2 = '副组长';
      vm.showss = true;
    } else if (vm.orgId === 3) {
      vm.dutyname1 = '负责人';
      vm.showss = false;
    }
    var user_grade = appService.user.user_grade;
    if (vm.orgId < 4) {
      vm.href = '/page/citybasicparty';
      switch (vm.orgId) {
        case 1:
          vm.ame = '区委党建领导小组';
          break;
        case 2:
          vm.ame = '区城市基层党建联席会';
          break;
        case 3:
          vm.ame = '区城市基层党建指挥平台';
          break;
      }
    } else if (vm.orgId > 3) {
      if (vm.commun) {
        if (vm.commun !== '0') {
          vm.ame = '社区党建联合会';
          if (user_grade === 7) {
            vm.href = '/page/citybasicparty-comm';
          } else {
            vm.href = '/page/citybasicparty-comm?id=' + vm.commun + '&street=' + vm.street;
          }
        } else if (vm.commun === '0') {
          vm.ame = '街道联席会';
          if (user_grade === 5) {
            vm.href = '/page/citybasicparty-str';
          } else {
            vm.href = '/page/citybasicparty-str?id=' + vm.street;
          }
        }
      }
      if (vm.partyid) {
        vm.href = '/page/citybasicpartydgw';
      }
    }
    menuService.leftMenusCollapsed = true;
    cityorgsetService.query({
      orgId: vm.orgId,
      Street: vm.street,
      community: vm.commun
    }).$promise.then(function (data) {
      console.log(data);
      vm.Orgset = data[0].OrgSet;
      if (vm.commun) {
        if (vm.commun === '0') {
          vm.duty = vm.Orgset[0].OrgTable.duty;
        } else {
          vm.duty = vm.Orgset[0]['OrgTable.duty'];
        }
      } else {
        vm.duty = vm.Orgset[0].OrgTable.duty;
      }
      //vm.duty = vm.commun !== '0' ? vm.Orgset[0]['OrgTable.duty'] : vm.Orgset[0].OrgTable.duty;
      $('.aaas').html(vm.duty);
      vm.OrgPerson = data[0].zz;
      vm.fzz = data[0].fzz;
      vm.cy = data[0].cy;
      vm.dataorgset = vm.Orgset[0];

      $timeout(function () {
        vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
        vm.show = true;
        $('.footers').css({
          position: 'absolute',
          width: '100%',
          top: vm.tops
        });
      }, 500);
    });
    vm.toNext = function (id) {
      $state.go('page.org-set-details-details', {data: vm.Orgset[id]});
    };
    vm.changeese = function (num) {
      $timeout(function () {
        vm.dataorgset = vm.Orgset[num];
      }, 200);
    };
  }
}());
