'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_JCDJ_UserRole_FunType = sequelize.define('dj_JCDJ_UserRole_FunType',
    {
      typeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      typeName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '1账号管理 2 权限管理 3 基础信息管理  4 区域化党建  5 重点工作动态 '
      }
    },
    {
      comment: 'dj_JCDJ_UserRole_FunType table'//,
      // indexes: [
      //   {
      //     //在外键上建立索引
      //     fields: ['user_id']
      //   }
      // ],
      // classMethods: {
      //   associate: function (models) {
      //     this.belongsTo(models.User,
      //       {foreignKey: 'user_id'});
      //   }
      // }
    }
  );
  dbExtend.addBaseCode('dj_JCDJ_UserRole_FunType', {attributes: ['typeID', 'typeName']});
  return dj_JCDJ_UserRole_FunType;
};
