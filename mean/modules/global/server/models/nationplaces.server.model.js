'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var nationplaceconstant = sequelize.define('nationplaceconstant',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '省市名称'
      }
    },
    {
      comment: '全国省市常量表'
    }
  );
  dbExtend.addBaseCode('nationplaceconstant', {attributes: ['id', 'name']});
  return nationplaceconstant;
};
