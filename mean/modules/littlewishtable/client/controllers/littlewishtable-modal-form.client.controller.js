(function () {
  'use strict';

  angular
    .module('littleWishTable')
    .controller('LittleWishTableModalFormController', LittleWishTableModalFormController);

  LittleWishTableModalFormController.$inject = ['$scope', '$uibModalInstance', 'littleWishTableData', 'method', 'columnDefs'];
  function LittleWishTableModalFormController($scope, $uibModalInstance, littleWishTableData, method, columnDefs) {
    var vm = this;
    vm.littleWishTableData = littleWishTableData;
    vm.method = method;

    vm.disabled = (method === '查看');
    vm.columnDefs = columnDefs;
    // 默认时间 当天
    if (method === '新增') {
      var curDate = new Date();
      vm.littleWishTableData.littleDate = curDate;
      vm.littleWishTableData.littleClaimDate = curDate;
    }

    //在这里处理要进行的操作
    vm.ok = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.littleWishTableForm');
        return;
      }
      if (vm.picFile) {
        vm.littleWishTableData.littlePhoto = vm.picFile;
      }
      $uibModalInstance.close(vm.littleWishTableData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    //状态 select
    vm.wanchengstatus = false;
    vm.weitonguo = false;
    var cvs_littleStatus;
    if (vm.littleWishTableData.littleStatus === '待审核') {
      cvs_littleStatus = [
        {name: '待审核'},
        {name: '待认领'},
        {name: '未通过'}
      ];
    } else if (vm.littleWishTableData.littleStatus === '待认领') {
      cvs_littleStatus = [
        {name: '待认领'},
        {name: '已认领'}
      ];
    } else if (vm.littleWishTableData.littleStatus === '已认领') {
      cvs_littleStatus = [
        {name: '已认领'},
        {name: '已完成'}
      ];
    } else if (vm.littleWishTableData.littleStatus === '未通过') {
      vm.weitonguo = true;
      vm.disabled = true;
      cvs_littleStatus = [
        {name: '未通过'}
      ];
    } else if (vm.littleWishTableData.littleStatus === '已完成') {
      vm.wanchengstatus = true;
      vm.disabled = true;
      cvs_littleStatus = [
        {name: '已完成'}
      ];
    } else {
      cvs_littleStatus = [
        {name: '待审核'},
        {name: '待认领'},
        {name: '未通过'},
        {name: '已认领'},
        {name: '已完成'}
      ];
    }
    $scope.cvs_littleStatus = cvs_littleStatus;
    if (method === '新增') {
      vm.littleWishTableData.littleStatus = '待审核';
    } else {
      vm.littleWishTableData.littleStatus = littleWishTableData.littleStatus;
    }
    vm.lwchange = function (status) {
      if (status === '已完成') {
        vm.wanchengstatus = true;
      } else if (status === '未通过') {
        vm.weitonguo = true;
      }
    };
    //日期选择器
    $scope.format = 'yyyy-MM-dd';
    $scope.today = function () {
      vm.littleWishTableData.littleDate = new Date(littleWishTableData.littleDate);
      vm.littleWishTableData.littleClaimDate = new Date(littleWishTableData.littleClaimDate);
    };
    $scope.today();
    $scope.clear = function () {
      vm.littleWishTableData.littleDate = null;
      vm.littleWishTableData.littleClaimDate = null;
    };

    $scope.inlineOptions = {
      customClass: getDayClass,
      minDate: new Date(),
      showWeeks: true
    };

    $scope.toggleMin = function () {
      $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    };

    $scope.toggleMin();
    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };
    $scope.open2 = function () {
      $scope.popup2.opened = true;
    };
    $scope.popup1 = {
      opened: false
    };
    $scope.popup2 = {
      opened: false
    };
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

    function getDayClass(data) {
      var date = data.date,
        mode = data.mode;
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

        for (var i = 0; i < $scope.events.length; i++) {
          var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }
      return '';
    }

    // end日期选择器

  }
}());
