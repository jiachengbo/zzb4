(function () {
  'use strict';

  angular
    .module('page')
    .controller('projectDetaliController', projectDetaliController);

  projectDetaliController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', 'projectprossService', '$timeout'];
  function projectDetaliController($scope, $window, baseCodeService, menuService, appService, $stateParams, projectprossService, $timeout) {
    var vm = this;
    vm.pageage = 1;
    vm.show = false;
    menuService.leftMenusCollapsed = true;
    console.log($stateParams.data);
    vm.project = $stateParams.data.ProjectTable || $stateParams.data;
    projectprossService.query({
      ProjectId: vm.project.ProjectId,
      count: true
    }).$promise.then(function (data) {
      console.log(data);
      vm.pagesum = data[0].shuliang;
      vm.count = Math.ceil(vm.pagesum / 4);
      console.log(vm.pagesum, vm.count);
    });
    projectprossService.query({
      ProjectId: vm.project.ProjectId,
      offset: 1
    }).$promise.then(function (data) {
      angular.forEach(data, function (v, kk) {
        v.ProgressTime = v.ProgressTime.slice(0, 11);
        console.log(v.ProgressTime);
      });
      vm.projectdata = data;
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
        projectprossService.query({
          ProjectId: vm.project.ProjectId,
          offset: num
        }).$promise.then(function (data) {
          vm.pageage = num;
          vm.projectdata = data;
          angular.element(document.querySelector('.pageactive')).removeClass('pageactive');
          $event.target.className = 'pageactive';
        });
      }
    };
    $timeout(function () {
      vm.tops = $window.parseInt($('section').css('height')) - 320 + 'px';
      vm.show = true;
      $('.footers').css({
        position: 'absolute',
        width: '100%',
        top: vm.tops,
        'z-index': 1
      });
    }, 200);
  }
}());
