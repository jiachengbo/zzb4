'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_InteractiveServiceType = sequelize.define('dj_InteractiveServiceType',
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
        comment: '1	工作动态   2	党员之家   3	服务互动'
      }
    },
    {
      comment: 'dj_InteractiveServiceType table'//,
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
  dbExtend.addBaseCode('dj_InteractiveServiceType', {attributes: ['typeID', 'typeName']});
  return dj_InteractiveServiceType;
};
