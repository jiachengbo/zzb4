'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var Mapcommunity = sequelize.define('Mapcommunity',
    {
      Mapcommunity_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      Mapcommunity_name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'Mapcommunity_name'
      },
      Mapcommunity_jingwei: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'Mapcommunity_jingwei'
      }
    },
    {
      comment: 'Mapcommunity table'
    }
  );
  dbExtend.addBaseCode('Mapcommunity', {
    attributes: ['Mapcommunity_id', 'Mapcommunity_name', 'Mapcommunity_jingwei']
  });
  return Mapcommunity;
};
