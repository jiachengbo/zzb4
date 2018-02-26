(function () {
  'use strict';

  // 定义前台使用的常量
  angular
    .module('global.services')
    //案件记录表状态常量
    .constant('RECSTATES', {
      //无效，初始状态
      INIT: 0,
      //待受理
      WAITACCEPT: 1,
      //已受理
      ACCEPTED: 2,
      //待核实
      WAITVERIFY: 3,
      //核实完成
      VERIFIED: 4,
      //待(批转)指挥中心处理
      WAITCONTROL: 5,
      //待处理完成
      WAITHANDLE: 6,
      //处理完成
      HANDLED: 7,
      //待(批转)监督中心处理
      WAITSUPERVISE: 8,
      //待核查完成
      WAITCHECK: 9,
      //核查完成
      CHECKED: 10,
      //已结案
      CLOSED: 11
    })
    //案件动作常量
    .constant('RECACT', {
      //登记
      RECORD: 1,
      //受理
      ACCEPT: 2,
      //立案
      REGISTER: 3,
      //确认巡查员发现并自行处理了问题
      AUTOFH: 4,
      //派发核实
      VERIFYDISPATCH: 5,
      //核实并返回结果
      VERIFYRET: 6,
      //派发专业部门处理
      HANDLEDISPATCH: 7,
      //处理并返回结果
      HANDLERET: 8,
      //批转,指挥中心和监督中心之间转移
      TRANSFER: 9,
      //派发核查
      CHECKDISPATCH: 10,
      //核查并返回结果
      CHECKRET: 11,
      //督办,在动作结果act_result中填写是否督办：0-否 1-是
      SUPERINTEND: 12,
      //结案
      CLOSE: 13,
      //废弃
      DISCARD: 14,
      //设置案件紧急重要程度，在动作结果act_result中填写级别
      PRIREC: 15
    });
}());
