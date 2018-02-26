(function () {
  'use strict';

  angular
    .module('page')
    .controller('wentiXQController', wentiXQController);

  wentiXQController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout', 'prowallService', '$state', '$location'];
  function wentiXQController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout, prowallService, $state, $location) {
    var vm = this;
    vm.show = false;
    var prowalldatas = {};
    prowalldatas.grade = $location.search().grade;
    prowalldatas.streetID = $location.search().streetID || '';
    prowalldatas.communityId = $location.search().communityId || '';
    prowalldatas.genersuper = $location.search().genersuper || '';
    prowalldatas.branchId = $location.search().branchId || '';
    prowalldatas.roleID = $location.search().roleId || '';
    prowalldatas.generalBranch = $location.search().generalBranch || '';
    prowalldatas.branchId = $location.search().branchId || '';
    var prowalldata = angular.copy(prowalldatas);
    prowalldata.offset = 1;
    var coutprowall = angular.copy(prowalldatas);
    coutprowall.count = true;
    // coutprowall.grade = $location.search().grade;
    // coutprowall.streetID = $location.search().streetID || '';
    // coutprowall.communityId = $location.search().communityId || '';
    // coutprowall.genersuper = $location.search().genersuper || '';
    // coutprowall.branchId = $location.search().branchId || '';
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    menuService.leftMenusCollapsed = true;
    vm.pageage = 1;
    function getprowall(prowalldata) {
      prowallService.query(prowalldata).$promise.then(function (data) {
        angular.forEach(data, function (v, k) {
          if (v.super === 32) {
            v.superName = '区委';
          } else if (v.super === 31) {
            v.superName = '党工委';
          } else if (v.super === 33) {
            v.superName = '党委';
          } else if (v.super < 31) {
            angular.forEach(dj_PartyOrganization, function (value, key) {
              if (value.typeID === v.super) {
                v.superName = value.typeName;
              }
            });
          }
        });
        vm.prowall = data;
      });
    }
    prowallService.query(coutprowall).$promise.then(function (data) {
      vm.pagesum = data[0].shuliang;
      vm.count = Math.ceil(vm.pagesum / 8);
    });
    vm.pageshu = function (num, $event) {
      if (isNaN(num)) {
        $window.alert('请输入数字');
        vm.pageage = 1;
      } else {
        if (num > vm.count) {
          num = vm.count;
        }
        if (num < 1) {
          num = 1;
        }
        angular.element(document.querySelector('.pageactive')).removeClass('pageactive');
        $event.target.className = 'pageactive';
        vm.pageage = num;
        prowalldata.offset = num;
        getprowall(prowalldata);
      }
    };
    getprowall(prowalldata);
    vm.proll = function (num) {
      $state.go('wentidetail', {data: vm.prowall[num]});
    };
    $timeout(function () {
      vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
      vm.show = true;
      $('.footers').css({
        position: 'absolute',
        width: '100%',
        top: vm.tops
      });
    }, 200);
  }
}());
