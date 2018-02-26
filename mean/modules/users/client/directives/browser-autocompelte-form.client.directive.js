(function () {
  'use strict';

  // 强制设置表单自动填充内容，防止自动填充的内容没有到达model
  angular
    .module('users')
    .directive('browserAutocompelteForm', browserAutocompelteForm);

  function browserAutocompelteForm() {
    return {
      priority: 10,
      link: function(scope, element, attrs) {
        element.on('submit', function (ev) {
          var inputEl = element.find('input');
          angular.forEach(inputEl, function (item) {
            var el = angular.element(item);
            var controller = el.controller('ngModel');
            if (controller) {
              controller.$setViewValue(el.val());
            }
          });
        });
      }
    };
  }
}());
