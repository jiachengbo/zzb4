'use strict';

var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));

module.exports = function (sequelize, DataTypes) {
  // 领导机构 表
  var OrgTable = sequelize.define('OrgTable',
    {
      orgId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      orgName: {
        type: DataTypes.STRING,
        comment: '领导机构名称'
      },
      duty: {
        type: DataTypes.STRING,
        comment: '工作职责'
      },
      Street: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        comment: '街道'
      }
    },
    {
      comment: '领导机构表',
      classMethods: {
        associate: function (models) {
          this.hasMany(models.OrgSet,
            {foreignKey: 'orgId', targetKey: 'orgId'});
          this.hasMany(models.OrgPerson,
            {foreignKey: 'orgId', targetKey: 'orgId'});
          this.hasMany(models.CommitteeTable,
            {foreignKey: 'Street', targetKey: 'Street'});
        }
      }
    }
  );
  dbExtend.addBaseCode('OrgTable', {attributes: ['orgId', 'orgName']});
  return OrgTable;
};
