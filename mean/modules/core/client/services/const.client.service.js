(function () {
  'use strict';

  // 定义前台使用的常量
  angular
    .module('core')
    //数据操作
    .constant('DBOP', {
      NONE: 0,
      VIEW: 1,
      ADD: 2,
      DEL: 3,
      UPDATE: 4,
      REFRESH: 5
    });
}());
