'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
/**
 * User Model
 */

module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define('Role',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        unique: true,
        defaultValue: ''
      },
      displayName: {
        type: DataTypes.STRING(100),
        defaultValue: ''
      },
      descText: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      parentId: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      comment: 'role table',
      // 定义表名,role是oracle关键字
      tableName: 'roleinfo',
      instanceMethods: {
      },

      classMethods: {
        associate: function (models) {
          this.belongsToMany(models.WorkPosition, {
            as: 'wps', //简短字段名，oracle限制总长不能超过30个字符
            through: models.WorkPositionRole,
            foreignKey: 'role_id'
          });
        }
      }
    }
  );

  //设置本表向外提供基础代码服务
  dbExtend.addBaseCode('Role', {attributes: ['id', 'name', 'displayName', 'parentId']});
  return Role;
};
