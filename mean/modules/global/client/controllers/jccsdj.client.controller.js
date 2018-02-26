(function () {
  'use strict';

  angular
    .module('global')
    .controller('jccsdjController', jccsdjController);

  jccsdjController.$inject = ['$state'];
  function jccsdjController($state) {
    var vm = this;
    vm.imgName = $state.$current.data.pageTitle;
    vm.tiaozhuan = function (num) {
      var src = `/modules/global/client/img/home/活动${num}.png`;
      $('.first>img').attr('src', src);
    };
  }
}());
