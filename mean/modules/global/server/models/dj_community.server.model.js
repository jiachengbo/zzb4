'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_community = sequelize.define('dj_community',
    {
      communityID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      communityName: {
        type: DataTypes.STRING(50),
        comment: '社区名称'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街道id'
      }
    },
    {
      comment: '社区表'
    }
  );
  dbExtend.addBaseCode('dj_community', {
    attributes: ['communityID', 'communityName', 'streetID']
  });
  return dj_community;
};
