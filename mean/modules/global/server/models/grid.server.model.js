'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var grid = sequelize.define('grid',
    {
      gridnumid: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false
      },
      gridId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      departmentId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      dutyUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      boundary: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      },
      context: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      createUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      createDate: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      modifyUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      modifyDate: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      gridNum: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      },
      is_syn: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'grid table'/*,
      classMethods: {
        associate: function (models) {
          this.hasMany(models.AdviceTable,
            {foreignKey: 'streetID', targetKey: 'streetID'});
          this.hasMany(models.ProblemTable,
            {foreignKey: 'streetID', targetKey: 'streetID'});
        }
      }*/
    }
  );
  dbExtend.addBaseCode('grid', {attributes: ['gridnumid', 'gridName', 'gridId', 'departmentId', 'gridNum', 'streetID']});
  return grid;
};
