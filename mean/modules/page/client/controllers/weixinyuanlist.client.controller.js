(function () {
  'use strict';

  angular
    .module('page')
    .controller('weixinYLController', weixinYLController);

  weixinYLController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout', 'litterxinService', '$state', '$location'];
  function weixinYLController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout, litterxinService, $state, $location) {
    var vm = this;
    vm.show = false;
    var prowalldatas = {};
    var prowalldata;
    var coutprowall;
    vm.alertMe = function (type) {
      prowalldatas.littleStatus = type;
      prowalldata = angular.copy(prowalldatas);
      prowalldata.offset = 1;
      coutprowall = angular.copy(prowalldatas);
      coutprowall.count = true;
      getprowall(prowalldata);
      getcount(coutprowall);
    };
    menuService.leftMenusCollapsed = true;
    vm.pageage = 1;
    function getprowall(prowalldata) {
      litterxinService.query(prowalldata).$promise.then(function (data) {
        console.log(data);
        vm.prowall = data;
      });
    }
    function getcount(coutprowall) {
      litterxinService.query(coutprowall).$promise.then(function (data) {
        vm.pagesum = data[0].shuliang;
        vm.count = Math.ceil(vm.pagesum / 8);
      });
    }
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
    vm.proll = function (num) {
      $state.go('weixindetail', {data: vm.prowall[num]});
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
