(function () {
  'use strict';

  angular
    .module('relationswitch')
    .controller('RelationswitchController', RelationswitchController);

  RelationswitchController.$inject = ['$scope', '$state', '$log', 'menuService'];
  function RelationswitchController($scope, $state, $log, menuService) {
    var vm = this;
    var pageTitles = [
      {'titleName': '党员信息管理'}
    ];
    //获取左边二级菜单选中项
    vm.sidemenu = menuService.getMenu('sidemenu');
    var bigTitleName = '';
    for (var i = 0; i < vm.sidemenu.items[4].items.length; i++) {
      if (vm.sidemenu.items[4].items[i].isSelected) {
        bigTitleName = vm.sidemenu.items[4].items[i].title;
      }
    }
    pageTitles.push({'titleName': bigTitleName});
    $scope.pageTitleInfo = pageTitles;

    //接收子控制器的数据
    $scope.$on('dwRelInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
    $scope.$on('dgwRelInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
    $scope.$on('dzzRelInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
    $scope.$on('dzbRelInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
  }
}());
