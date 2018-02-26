'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var TaskType = sequelize.define('TaskType',
    {
      typeid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      typename: {
        type: DataTypes.STRING,
        comment: '任务类型名称'
      }
    },
    {
      comment: 'TaskType table'
    }
  );
  dbExtend.addBaseCode('TaskType', {attributes: ['typeid', 'typename']});
  return TaskType;
};
