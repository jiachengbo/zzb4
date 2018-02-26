'use strict';

module.exports = function (sequelize, DataTypes) {

  var Assigned_jb_bm = sequelize.define('Assigned_jb_bm',
    {
      Id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      AssignedId: {
        type: DataTypes.INTEGER,
        comment: '任务id'
      },
      GradeID: {
        type: DataTypes.INTEGER,
        comment: '层级id'
      },
      SendObjectId: {
        type: DataTypes.INTEGER,
        comment: '对象id'
      },
      SendObjectName: {
        type: DataTypes.STRING,
        comment: '对象名称'
      },
      TaskProgress: {
        type: DataTypes.INTEGER,
        comment: '任务进度'
      },
      FinishedTime: {
        type: DataTypes.DATE,
        comment: '完成时间'
      },
      isOnTime: {
        type: DataTypes.INTEGER,
        comment: '是否准时'
      },
      // img1: {
      //   type: DataTypes.STRING,
      //   comment: '照片1'
      // },
      // img2: {
      //   type: DataTypes.STRING,
      //   comment: '照片2'
      // },
      // img3: {
      //   type: DataTypes.STRING,
      //   comment: '照片3'
      // },
      // file: {
      //   type: DataTypes.STRING,
      //   comment: '文件'
      // },
      remark: {
        type: DataTypes.STRING,
        comment: '文件'
      }
    },
    {
      comment: '关系表 table'
    }
  );
  return Assigned_jb_bm;
};
