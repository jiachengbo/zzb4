(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'appService', 'Notification', '$rootScope'];

  function EditProfileController($scope, $http, $location, UsersService, appService, Notification, $rootScope) {
    var vm = this;

    vm.user = appService.user;
    vm.updateUserProfile = updateUserProfile;

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      $rootScope._openModal();
      var user = new UsersService(vm.user);
      user.$update(function (response) {
        $rootScope.cancel();
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 修改成功!' });
        appService.user = response;
      }, function (response) {
        $rootScope.cancel();
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 修改失败!' });
      });
    }
  }
}());
