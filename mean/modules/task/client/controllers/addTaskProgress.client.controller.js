(function () {
  'use strict';

  angular
    .module('task')
    .controller('addTaskProgressController', addTaskProgressController);

  addTaskProgressController.$inject = ['$scope', 'Notification', '$log', '$window',
    '$uibModalInstance', 'baseCodeService',
    'assigned_jb_bm_id', 'UserMsg', 'appService'];
  function addTaskProgressController($scope, Notification, $log, $window,
                                     $uibModalInstance, baseCodeService, assigned_jb_bm_id, UserMsg, appService) {
    var vm = this;
    vm.assigned_jb_bm_id = assigned_jb_bm_id;
    //上报文件
    vm.create_photoPicFile = null;
    vm.create_photoPicFile2 = null;
    vm.create_photoPicFile3 = null;
    vm.fileSelected = false;
    vm.fileSelected2 = false;
    vm.fileSelected3 = false;
    vm.loading = false;
    vm.loading2 = false;
    vm.loading3 = false;
    vm.uploadData = {};
    vm.isend = false;
    //在这里处理要进行的操作
    vm.ok = function () {
      vm.uploadData.img1 = vm.create_photoPicFile;
      vm.uploadData.img2 = vm.create_photoPicFile2;
      vm.uploadData.img3 = vm.create_photoPicFile3;
      vm.uploadData.progressFile = vm.fileFile;
      vm.uploadData.assigned_jb_bm_id = vm.assigned_jb_bm_id;
      vm.uploadData.progressContent = vm.progressContent;
      vm.uploadData.createUser = appService.user.id;
      if (vm.isend) {
        vm.uploadData.remarks = '已完成';
      } else {
        vm.uploadData.remarks = '推进中';
      }

      $uibModalInstance.close(vm.uploadData);
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }

  //  放大图片
  angular
    .module('task')
    .directive('enlargePic', function () { //enlargePic指令名称，写在需要用到的地方img中即可实现放大图片
      return {
        restrict: 'AE',
        link: function (scope, elem) {
          elem.bind('click', function ($event) {
            var img = $event.srcElement || $event.target;
            angular.element(document.querySelector('.mask'))[0].style.display = 'block';
            angular.element(document.querySelector('.bigPic'))[0].src = img.src;
          });
        }
      };
    })
    .directive('closePic', function () {
      return {
        restrict: 'AE',
        link: function (scope, elem) {
          elem.bind('click', function ($event) {
            angular.element(document.querySelector('.mask'))[0].style.display = 'none';
          });
        }
      };
    });
}());
