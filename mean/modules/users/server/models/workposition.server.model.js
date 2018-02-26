'use strict';

var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));

/**
 * User Model
 */

module.exports = function (sequelize, DataTypes) {
  var WorkPosition = sequelize.define('WorkPosition',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
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
      department_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        comment: 'foreignKey department(id)'
      }
    },
    {
      comment: 'work position',
      indexes: [
        {
          fields: ['department_id']
        }
      ],

      instanceMethods: {
      },

      classMethods: {
        associate: function (models) {
          this.belongsTo(models.Department,
            {foreignKey: 'department_id', targetKey: 'id'});

          this.belongsToMany(models.Role, {
            through: models.WorkPositionRole,
            foreignKey: 'workposition_id'
          });
          this.belongsToMany(models.User, {
            through: models.WorkPositionUser,
            foreignKey: 'workposition_id'
          });
        }
      }
    }
  );

  //设置本表向外提供基础代码服务
  dbExtend.addBaseCode('WorkPosition', {attributes: ['id', 'name', 'displayName', 'department_id']});

  return WorkPosition;
};
