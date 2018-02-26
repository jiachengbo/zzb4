(function () {
  'use strict';

  angular
    .module('page.services')
    .factory('jcdjuserService', jcdjuserService);

  jcdjuserService.$inject = ['$resource', '$log'];

  function jcdjuserService($resource, $log) {
    var jcdjuser = $resource('/api/jcdjuser');
    return jcdjuser;
  }
}());
