(function () {
  'use strict';

  angular
    .module('core')
    .controller('FooterController', FooterController);

  FooterController.$inject = ['$window'];

  function FooterController($window) {
    var vm = this;
    vm.copyRight = $window.sharedConfig.copyRight;
  }
}());
