'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var nationconstant = sequelize.define('nationconstant',
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
        comment: '民族名称'
      }
    },
    {
      comment: '民族常量表'
    }
  );
  dbExtend.addBaseCode('nationconstant', {attributes: ['id', 'name']});
  return nationconstant;
};
