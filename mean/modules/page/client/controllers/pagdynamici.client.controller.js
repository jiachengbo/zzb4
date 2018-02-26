(function () {
  'use strict';

  angular
    .module('page')
    .controller('partydynamicController', partydynamicController);

  partydynamicController.$inject = ['$scope', '$window', 'baseCodeService', 'menuService', 'appService', '$stateParams', '$timeout'];
  function partydynamicController($scope, $window, baseCodeService, menuService, appService, $stateParams, $timeout) {
    var vm = this;
    menuService.leftMenusCollapsed = true;
    vm.partydynamic = $stateParams.data;
    console.log(vm.partydynamic);
    $('#appealContext').html(vm.partydynamic.appealContext);
    var img1 = !!vm.partydynamic.phoneOnePath;
    var img2 = !!vm.partydynamic.photoTwoimagePath;
    var img3 = !!vm.partydynamic.photoThreeimagePath;
    if (img1 && img2 && img3) {
      vm.img3f = true;
    } else if (img1 && img2 && !img3) {
      vm.img2f = true;
      vm.imagePathone = vm.partydynamic.photoTwoimagePath;
      vm.imagePathtwo = vm.partydynamic.phoneOnePath;
    } else if (img1 && img3 && !img2) {
      vm.img2f = true;
      vm.imagePathone = vm.partydynamic.phoneOnePath;
      vm.imagePathtwo = vm.partydynamic.photoThreeimagePath;
    } else if (img2 && img3 && !img1) {
      vm.img2f = true;
      vm.imagePathone = vm.partydynamic.photoTwoimagePath;
      vm.imagePathtwo = vm.partydynamic.photoThreeimagePath;
    } else if (img1 && !img2 && !img3) {
      vm.img1f = true;
      vm.imagePathone = vm.partydynamic.phoneOnePath;
    } else if (img2 && !img1 && !img3) {
      vm.img1f = true;
      vm.imagePathone = vm.partydynamic.photoTwoimagePath;
    } else if (img3 && !img2 && !img1) {
      vm.img1f = true;
      vm.imagePathone = vm.partydynamic.photoThreeimagePath;
    }
  }
}());
