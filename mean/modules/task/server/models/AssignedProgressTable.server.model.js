'use strict';

module.exports = function (sequelize, DataTypes) {

  var AssignedProgressTable = sequelize.define('AssignedProgressTable',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      assigned_jb_bm_id: {
        type: DataTypes.INTEGER,
        comment: '任务关系表id'
      },
      progressContent: {
        type: DataTypes.STRING,
        comment: '任务进度内容'
      },
      img1: {
        type: DataTypes.STRING,
        comment: '照片1'
      },
      img2: {
        type: DataTypes.STRING,
        comment: '照片2'
      },
      img3: {
        type: DataTypes.STRING,
        comment: '照片3'
      },
      progressFile: {
        type: DataTypes.STRING,
        comment: '文件'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        comment: '是否删除'
      },
      createUser: {
        type: DataTypes.INTEGER,
        comment: '创建人'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      remarks: {
        type: DataTypes.STRING,
        comment: '备注'
      }
    },
    {
      comment: 'AssignedProgressTable table'
    }
  );
  return AssignedProgressTable;
};
