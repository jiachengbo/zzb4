(function () {
  'use strict';

  angular
    .module('global')
    .controller('ChildWelcomeController', ChildWelcomeController);

  ChildWelcomeController.$inject = ['$state'];
  function ChildWelcomeController($state) {
    var vm = this;
    vm.imgName = $state.$current.data.imgName;
    // vm.pageTitle = $state.$current.data.pageTitle;
    vm.sectionStyle = {
      'background-image': 'url(\'/modules/global/client/img/images/' + vm.imgName + '-bg.png\')'
    };
  }
}());
