(function () {
  'use strict';

  angular
    .module('basicinfo')
    .controller('TopVoiceinfoModalFormController', TopVoiceinfoModalFormController);

  TopVoiceinfoModalFormController.$inject = ['$scope', '$uibModalInstance', 'topvoiceData', 'method', 'typeid'];
  function TopVoiceinfoModalFormController($scope, $uibModalInstance, topvoiceData, method, typeid) {
    var vm = this;
    vm.topvoiceData = topvoiceData;
    vm.topvoiceData.type = typeid;
    vm.method = method;
    vm.iscreatedate = true;
    vm.disabled = (method === '查看');
    if (method === '新增') {
      vm.iscreatedate = false;
    }
    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.topvoiceForm');
        return;
      }
      if (vm.topvoiceData.content === undefined || vm.topvoiceData.content === '') {
        vm.yzContent = true;
        return;
      } else {
        vm.yzContent = false;
      }
      if (vm.picFile) {
        vm.topvoiceData.photos = vm.picFile;
      }
      if (vm.fileFile) {
        vm.topvoiceData.file_path = vm.fileFile;
      }
      vm.topvoiceData.sbtime = $scope.sbtime;
      $uibModalInstance.close(vm.topvoiceData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
    //日期选择器
    $scope.today = function () {
      var now = new Date();
      now.setDate(1);
      if (vm.topvoiceData.sbtime) {
        $scope.sbtime = new Date(vm.topvoiceData.sbtime);
      } else {
        $scope.sbtime = new Date();
      }
    };
    $scope.today();
    /*if (vm.method === '修改' || vm.method === '查看') {
      console.log(vm.topvoiceData);
      $scope.sbtime = new Date(vm.topvoiceData.sbtime); // 开始时间
    }*/
    $scope.clear = function () {
      $scope.sbtime = null;
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
  }
}());
