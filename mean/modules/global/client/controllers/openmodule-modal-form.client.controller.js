(function () {
  'use strict';

  angular
    .module('global')
    .controller('openmoduleController', openmoduleController);

  openmoduleController.$inject = ['$scope', '$uibModalInstance', '$rootScope', '$timeout'];
  function openmoduleController($scope, $uibModalInstance, $rootScope, $timeout) {
    var vm = this;
    //在这里处理要进行的操作
    $timeout(function () {
      angular.element(document.querySelector('.modal-content')).css({
        'position': 'relative',
        'top': '350px',
        'background-color': 'transparent',
        '-webkit-background-clip': 'border-box',
        'background-clip': 'border-box',
        'border': 'none',
        'border-radius': 'none',
        'outline': 0,
        '-webkit-box-shadow': 'none',
        'box-shadow': 'none'
      });
    }, 200);

    vm.ok = function (isValid) {
      if (!isValid) {
        return;
      }
      $uibModalInstance.close(vm.yloData);
    };
    $rootScope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
