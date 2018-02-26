'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_PartyCommitteeType = sequelize.define('dj_PartyCommitteeType',
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
        comment: '党委、党工委'
      }
    },
    {
      comment: 'dj_PartyCommitteeType table'//,
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
  dbExtend.addBaseCode('dj_PartyCommitteeType', {attributes: ['typeID', 'typeName']});
  return dj_PartyCommitteeType;
};
