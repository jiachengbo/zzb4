'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var MapAreat = sequelize.define('MapAreat',
    {
      MapAreat_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      MapAreat_name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'MapAreat_name'
      },
      MapAreat_jingwei: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'MapAreat_jingwei'
      }
    },
    {
      comment: 'MapAreat table'
    }
  );
  dbExtend.addBaseCode('MapAreat', {
    attributes: ['MapAreat_id', 'MapAreat_name', 'MapAreat_jingwei']
  });
  return MapAreat;
};
