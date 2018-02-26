'use strict';

// var path = require('path'),
  // dbExtend = require(path.resolve('./config/lib/dbextend'));

module.exports = function (sequelize, DataTypes) {
  // 领导机构 表
  var workzhize = sequelize.define('workzhize',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      duty: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '工作职责'
      },
      Street: {
        type: DataTypes.INTEGER,
        comment: '街道'
      },
      community: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '街道'
      }
    },
    {
      comment: '社区工作职责'/*,
      classMethods: {
        associate: function (models) {
          this.hasMany(models.OrgSet,
            {foreignKey: 'orgId', targetKey: 'orgId'});
          this.hasMany(models.OrgPerson,
            {foreignKey: 'orgId', targetKey: 'orgId'});
          this.hasMany(models.CommitteeTable,
            {foreignKey: 'Street', targetKey: 'Street'});
        }
      }*/
    }
  );
  // dbExtend.addBaseCode('OrgTable', {attributes: ['orgId', 'orgName']});
  return workzhize;
};
