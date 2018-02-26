'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_PartyOrganization = sequelize.define('dj_PartyOrganization',
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
        comment: '党工委、党委名称'
      },
      simpleName: {
        type: DataTypes.STRING,
        comment: '简称'
      },
      comType: {
        type: DataTypes.INTEGER,
        comment: '模块类型（党委、党工委）'
      },
      roleID: {
        type: DataTypes.INTEGER,
        comment: '角色ID'
      },
      GradeID: {
        type: DataTypes.INTEGER,
        comment: '层级ID'
      }
    },
    {
      comment: 'dj_PartyOrganization table',
      classMethods: {
        associate: function (models) {
          this.hasMany(models.dj_PartyGeneralBranch,
            {foreignKey: 'superior', targetKey: 'typeID'});
        }
      }
    }
  );
  dbExtend.addBaseCode('dj_PartyOrganization', {attributes: ['typeID', 'typeName', 'simpleName', 'comType', 'roleID', 'GradeID']});
  return dj_PartyOrganization;
};
