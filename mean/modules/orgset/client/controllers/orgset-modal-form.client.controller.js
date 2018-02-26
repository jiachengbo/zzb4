(function () {
  'use strict';

  angular
    .module('orgset')
    .controller('OrgsetModalFormController', OrgsetModalFormController);

  OrgsetModalFormController.$inject = ['$scope', '$uibModalInstance', 'orgsetData', 'method', 'columnDefs', 'baseCodeService'];
  function OrgsetModalFormController($scope, $uibModalInstance, orgsetData, method, columnDefs, baseCodeService) {
    var vm = this;
    vm.orgsetData = orgsetData;
    console.log(orgsetData);
    vm.method = method;
    vm.disabled = (method === '查看');
    vm.columnDefs = columnDefs;
    var cvs_org = baseCodeService.getItems('OrgTable');
    $scope.cvs_org = cvs_org;

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.orgsetForm');
        return;
      }
      // 会议图片1
      if (vm.meetingPhoto) {
        vm.orgsetData.meetingPhoto = vm.meetingPhoto;
      }
      // 会议图片2
      if (vm.meetingPhoto2) {
        vm.orgsetData.meetingPhoto2 = vm.meetingPhoto2;
      }
      if (vm.docFile) {
        vm.orgsetData.file_path = vm.docFile;
      }
      vm.orgsetData.community = orgsetData.community;
      vm.orgsetData.street = orgsetData.orgId - 3;
      console.log(vm.orgsetData);
      $uibModalInstance.close(vm.orgsetData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    //日期选择器
    $scope.today = function () {
      vm.orgsetData.createTime = new Date(orgsetData.createTime);
    };
    $scope.today();
    $scope.clear = function () {
      vm.orgsetData.createTime = null;
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
    $scope.popup1 = {
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
