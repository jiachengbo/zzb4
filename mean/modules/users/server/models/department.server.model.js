'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));

/**
 * department Model
 */

module.exports = function (sequelize, DataTypes) {
  var Department = sequelize.define('Department',
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
      comment: 'department table',
      instanceMethods: {
      },

      classMethods: {
        associate: function (models) {
          this.hasMany(models.User,
            {foreignKey: 'department_id', targetKey: 'id'});
          this.hasMany(models.WorkPosition,
            {foreignKey: 'department_id', targetKey: 'id'});
          //不能建立到自己的约束
          //this.hasOne(this, {foreignKey: 'parentId'});
        }
      }
    }
  );

  //设置本表向外提供基础代码服务
  dbExtend.addBaseCode('Department', {attributes: ['id', 'name', 'displayName', 'parentId']});

  return Department;
};
