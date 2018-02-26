'use strict';

module.exports = function (sequelize, DataTypes) {
  //项目进展表
  var ProgressTable = sequelize.define('ProgressTable',
    {
      ProgressId: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false
      },
      ProjectId: {
        type: DataTypes.STRING,
        comment: 'progress_table'
      },
      ProgressTime: {
        type: DataTypes.DATE,
        comment: 'ProgressTime'
      },
      ProgressContent: {
        type: DataTypes.STRING(5000),
        defaultValue: '',
        comment: 'ProgressContent'
      },
      ProgressPhoto: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        comment: 'ProgressPhoto'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'isdelete'
      },
      createUserId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'createUserId'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: 'createDate'
      },
      modifyUserId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'modifyUserId'
      },
      modifyDate: {
        type: DataTypes.DATE,
        comment: 'modifyDate'
      }
    },
    {
      comment: '项目进展表'
    }
  );

  return ProgressTable;
};
