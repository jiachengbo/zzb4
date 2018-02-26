(function () {
  'use strict';

  angular
    .module('task')
    .controller('TaskProgressDetailsController', TaskProgressDetailsController);

  TaskProgressDetailsController.$inject = ['$scope', '$log', '$window', '$uibModalInstance', 'appService', '$state', 'detailsdata', 'PayoutBMService'];
  function TaskProgressDetailsController($scope, $log, $window, $uibModalInstance, appService, $state, detailsdata, PayoutBMService) {
    var vm = this;
    vm.detailsData = detailsdata;
    console.log(vm.detailsData);
    // PayoutBMService.query({Id: vm.id}).$promise.then(function (data) {
    //   console.log(data);
    //   vm.detailsData = data[0];
    // })
    vm.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }
}());
