'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var MapStreet = sequelize.define('MapStreet',
    {
      MapStreet_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      MapStreet_name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'MapGrid_name'
      },
      MapStreet_jingwei: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'MapGrid_gridid'
      }
    },
    {
      comment: 'MapStreet table'
    }
  );
  dbExtend.addBaseCode('MapStreet', {
    attributes: ['MapStreet_id', 'MapStreet_name', 'MapStreet_jingwei']
  });
  return MapStreet;
};
