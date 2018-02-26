(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$timeout', 'appService', 'Upload', 'Notification', '$rootScope'];

  function ChangeProfilePictureController($timeout, appService, Upload, Notification, $rootScope) {
    var vm = this;

    vm.user = appService.user;
    vm.progress = 0;

    vm.upload = function (dataUrl) {
      $rootScope._openModal();
      Upload.upload({
        url: '/api/users/picture',
        data: {
          aaa: 'tttt',
          newProfilePicture: dataUrl,
          bbb: 2222,
          end: new Date()
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      $rootScope.cancel();
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture' });

      // Populate user object
      vm.user = appService.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      $rootScope.cancel();
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture' });
    }
  }
}());
