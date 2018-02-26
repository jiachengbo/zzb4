(function () {
  'use strict';

  angular
    .module('global')
    .controller('PageFrameController', PageFrameController);

  PageFrameController.$inject = ['$scope', 'menuService', '$log'];

  function PageFrameController($scope, menuService, $log) {
    var vm = this;
    var sidemenu = menuService.getMenu('sidemenu');
    /*sidemenu.items.forEach(function (item) {
      if (item.title === '地理信息管理系统') {
        item.icon1 = '/modules/global/client/img/images/map1.png';
        item.icon2 = '/modules/global/client/img/images/map2.png';
      } else if (item.title === '公共服务系统') {
        item.icon1 = '/modules/global/client/img/images/ggfw1.png';
        item.icon2 = '/modules/global/client/img/images/ggfw2.png';
      } else if (item.title === '监督受理平台') {
        item.icon1 = '/modules/global/client/img/images/jdsl1.png';
        item.icon2 = '/modules/global/client/img/images/jdsl2.png';
      } else if (item.title === '监督指挥平台') {
        item.icon1 = '/modules/global/client/img/images/pqy1.png';
        item.icon2 = '/modules/global/client/img/images/pqy2.png';
      } else if (item.title === '协同工作平台') {
        item.icon1 = '/modules/global/client/img/images/xt1.png';
        item.icon2 = '/modules/global/client/img/images/xt2.png';
      } else if (item.title === '系统管理') {
        item.icon1 = '/modules/global/client/img/images/sys1.png';
        item.icon2 = '/modules/global/client/img/images/sys2.png';
      } else if (item.title === '城市治理数据管理') {
        item.icon1 = '/modules/global/client/img/images/city1.png';
        item.icon2 = '/modules/global/client/img/images/city2.png';
      } else if (item.title === '经济发展数据管理') {
        item.icon1 = '/modules/global/client/img/images/jjfz1.png';
        item.icon2 = '/modules/global/client/img/images/jjfz2.png';
      } else if (item.title === '基层党建数据管理') {
        item.icon1 = '/modules/global/client/img/images/jcdj1.png';
        item.icon2 = '/modules/global/client/img/images/jcdj2.png';
      } else if (item.title === '网格地域管理') {
        item.icon1 = '/modules/global/client/img/images/wgdy1.png';
        item.icon2 = '/modules/global/client/img/images/wgdy2.png';
      } else if (item.title === '网格评价管理') {
        item.icon1 = '/modules/global/client/img/images/wgpj1.png';
        item.icon2 = '/modules/global/client/img/images/wgpj2.png';
      } else if (item.title === '网格人员管理') {
        item.icon1 = '/modules/global/client/img/images/wgry1.png';
        item.icon2 = '/modules/global/client/img/images/wgry2.png';
      } else if (item.title === '网格零报告管理') {
        item.icon1 = '/modules/global/client/img/images/wglbg1.png';
        item.icon2 = '/modules/global/client/img/images/wglbg2.png';
      } else if (item.title === '网格事件管理') {
        item.icon1 = '/modules/global/client/img/images/wgsj1.png';
        item.icon2 = '/modules/global/client/img/images/wgsj2.png';
      } else if (item.title === '社会稳定数据管理') {
        item.icon1 = '/modules/global/client/img/images/shwd1.png';
        item.icon2 = '/modules/global/client/img/images/shwd2.png';
      } else if (item.title === '公共服务数据管理') {
        item.icon1 = '/modules/global/client/img/images/ggfwsj1.png';
        item.icon2 = '/modules/global/client/img/images/ggfwsj2.png';
      } else if (item.title === '数据分析平台') {
        item.icon1 = '/modules/global/client/img/images/sjfx1.png';
        item.icon2 = '/modules/global/client/img/images/sjfx2.png';
      } else if (item.title === '综合评价平台') {
        item.icon1 = '/modules/global/client/img/images/zhpj1.png';
        item.icon2 = '/modules/global/client/img/images/zhpj2.png';
      } else if (item.title === '督办终端子系统') {
        item.icon1 = '/modules/global/client/img/images/dbzd1.png';
        item.icon2 = '/modules/global/client/img/images/dbzd2.png';
      } else if (item.title === '计时管理') {
        item.icon1 = '/modules/global/client/img/images/jsgl1.png';
        item.icon2 = '/modules/global/client/img/images/jsgl2.png';
      } else if (item.title === '处置终端子系统') {
        item.icon1 = '/modules/global/client/img/images/cz1.png';
        item.icon2 = '/modules/global/client/img/images/cz2.png';
      } else if (item.title === '采集终端子系统') {
        item.icon1 = '/modules/global/client/img/images/cj1.png';
        item.icon2 = '/modules/global/client/img/images/cj2.png';
      }
    });*/
  }
}());
