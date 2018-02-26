(function () {
  'use strict';

  angular
    .module('partymember')
    .controller('PartymemberCURDTableController', PartymemberCURDTableController);

  PartymemberCURDTableController.$inject = ['$scope', '$log', '$window', 'menuService'];
  function PartymemberCURDTableController($scope, $log, $window, menuService) {
    var vm = this;
    var pageTitles = [
      {'titleName': '党员信息管理'}
    ];
    //获取左边二级菜单选中项
    vm.sidemenu = menuService.getMenu('sidemenu');
    var bigTitleName = '';
    for (var i = 0; i < vm.sidemenu.items[2].items.length; i++) {
      if (vm.sidemenu.items[2].items[i].isSelected) {
        bigTitleName = vm.sidemenu.items[2].items[i].title;
      }
    }
    pageTitles.push({'titleName': bigTitleName});
    $scope.pageTitleInfo = pageTitles;

    //接收子控制器的数据
    $scope.$on('dwInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
    $scope.$on('dgwInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
    $scope.$on('dzzInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
    $scope.$on('dzbInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
  }
}());
