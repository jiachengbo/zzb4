'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var MapGrid = sequelize.define('MapGrid',
    {
      MapGrid_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      MapGrid_name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'MapGrid_name'
      },
      MapGrid_gridid: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'MapGrid_gridid'
      },
      MapGrid_jingwei: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'MapGrid_jingwei'
      }
    },
    {
      comment: 'MapGrid table'
    }
  );
  dbExtend.addBaseCode('MapGrid', {
    attributes: ['MapGrid_id', 'MapGrid_name', 'MapGrid_gridid', 'MapGrid_jingwei']
  });
  return MapGrid;
};
