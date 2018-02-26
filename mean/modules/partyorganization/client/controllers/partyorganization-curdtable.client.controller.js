(function () {
  'use strict';

  angular
    .module('partyorganization')
    .controller('PartyorganizationCURDTableController', PartyorganizationCURDTableController);

  PartyorganizationCURDTableController.$inject = ['$scope', '$log', 'menuService'];
  function PartyorganizationCURDTableController($scope, $log, menuService) {
    var vm = this;
    var pageTitles = [
      {'titleName': '党组织信息管理'}
    ];
    //获取左边二级菜单选中项
    vm.sidemenu = menuService.getMenu('sidemenu');
    var bigTitleName = '';
    for (var i = 0; i < vm.sidemenu.items[3].items.length; i++) {
      if (vm.sidemenu.items[3].items[i].isSelected) {
        bigTitleName = vm.sidemenu.items[3].items[i].title;
      }
    }
    pageTitles.push({'titleName': bigTitleName});
    $scope.pageTitleInfo = pageTitles;

    //接收子控制器的数据
    $scope.$on('dwOrgInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
    $scope.$on('dgwOrgInfo', function (event, data) {
      pageTitles.push(
        {'titleName': data}
      );
    });
  }
}());
