(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$http', 'appService', 'UsersService', 'PasswordValidator', 'Notification', '$rootScope'];

  function ChangePasswordController($scope, $http, appService, UsersService, PasswordValidator, Notification, $rootScope) {
    var vm = this;

    vm.user = appService.user;
    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // Change user password
    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

        return false;
      }
      $rootScope._openModal();
      UsersService.changePassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      $rootScope.cancel();
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Changed Successfully' });
      vm.passwordDetails = null;
    }

    function onChangePasswordError(response) {
      $rootScope.cancel();
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password change failed!' });
    }
  }
}());
