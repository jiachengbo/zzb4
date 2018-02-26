'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_PartyHomeType = sequelize.define('dj_PartyHomeType',
    {
      typeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      typeName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'dj_PartyHomeType table'//,
      // indexes: [
      //   {
      //     //在外键上建立索引
      //     fields: ['user_id']
      //   }
      // ],
      // classMethods: {
      //   associate: function (models) {
      //     this.belongsTo(models.User,
      //       {foreignKey: 'user_id'});
      //   }
      // }
    }
  );
  dbExtend.addBaseCode('dj_PartyHomeType', {attributes: ['typeID', 'typeName']});
  return dj_PartyHomeType;
};
