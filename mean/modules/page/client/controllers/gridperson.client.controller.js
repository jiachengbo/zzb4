(function () {
  'use strict';

  angular
    .module('global')
    .controller('GridPersonController', GridPersonController);

  GridPersonController.$inject = ['$state', '$scope', 'commjobService', 'appService', '$window', 'commpartyService', 'commthreefiveService', '$location', 'prowallService', 'baseCodeService'];
  function GridPersonController($state, $scope, commjobService, appService, $window, commpartyService, commthreefiveService, $location, prowallService, baseCodeService) {
    var vm = this;
    var dj_PartyOrganization = baseCodeService.getItems('dj_PartyOrganization');
    vm.street = $window.parseInt($location.search().street);
    vm.comm = $location.search().comm;
    vm.grid = $location.search().grid;
    console.log(vm.street, vm.comm, vm.grid);
    prowallService.query({
      gridId: vm.grid,
      streetID: vm.street,
      communityId: vm.comm
    }).$promise.then(function (data) {
      angular.forEach(data, function (v, k) {
        if (v.super === 32) {
          v.superName = '区委';
        } else if (v.super === 31) {
          v.superName = '党工委';
        } else if (v.super < 31) {
          angular.forEach(dj_PartyOrganization, function (value, key) {
            if (value.typeID === v.super) {
              v.superName = value.typeName;
            }
          });
        }
      });
      vm.prowall = data;
    });
    commjobService.query({
      streetid: vm.street,
      communityid: vm.comm,
      gridId: vm.grid
    }).$promise.then(function (data) {
      vm.jobzhize = data[0];
    });
    commpartyService.query({
      streetid: vm.street,
      communityid: vm.comm,
      gridId: vm.grid
    }).$promise.then(function (data) {
      vm.wornode = data[0];
    });
    commthreefiveService.query({
      streetid: vm.street,
      communityid: vm.comm,
      gridId: vm.grid
    }).$promise.then(function (data) {
      vm.threefive = data[0];
    });
    vm.proll = function (num) {
      $state.go('wentidetail', {data: vm.prowall[num]});
    };
  }
}());
