(function () {
  'use strict';

  angular
    .module('majorsecretary')
    .controller('MajorsecretaryModalFormController', MajorsecretaryModalFormController);

  MajorsecretaryModalFormController.$inject = ['$scope', '$uibModalInstance', 'majorsecretaryData', 'method', 'UserMsg'];
  function MajorsecretaryModalFormController($scope, $uibModalInstance, majorsecretaryData, method, UserMsg) {
    var vm = this;
    UserMsg.func();
    vm.majorsecretaryData = majorsecretaryData;
    vm.method = method;
    if (vm.method === 'add') {
      vm.method = '新增';
    } else if (vm.method === 'update') {
      vm.method = '修改';
    } else if (vm.method === 'view') {
      vm.method = '查看';
    }
    vm.disabled = (method === 'view');

    //在这里处理要进行的操作
    vm.ok = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.majorsecretaryForm');
        return;
      }
      vm.majorsecretaryData.photo = vm.create_photoPicFile;
      if (vm.create_videoFile) {
        vm.majorsecretaryData.video_file = vm.create_videoFile;
      }
      vm.majorsecretaryData.gradeId = UserMsg.gradeId;
      vm.majorsecretaryData.objId = UserMsg.objId;
      $uibModalInstance.close(vm.majorsecretaryData);
    };
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
