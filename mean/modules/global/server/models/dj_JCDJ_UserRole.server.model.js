'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_JCDJ_UserRole = sequelize.define('dj_JCDJ_UserRole',
    {
      UserRoleID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      UserRoleName: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '用户角色'
      },
      descriptor: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        comment: '用户角色'
      },
      UserGradeID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '用户等级'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '街道id'
      },
      departy: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '单位'
      }
    },
    {
      comment: 'dj_JCDJ_UserRole table'//,
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
  dbExtend.addBaseCode('dj_JCDJ_UserRole', {attributes: ['UserRoleID', 'UserRoleName', 'descriptor', 'UserGradeID', 'departy', 'streetID']});
  return dj_JCDJ_UserRole;
};
