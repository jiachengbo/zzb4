'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_org_class = sequelize.define('dj_org_class',
    {
      org_class_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      class_Name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'dj_org_class table'//,
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
  dbExtend.addBaseCode('dj_org_class', {attributes: ['org_class_ID', 'class_Name']});
  return dj_org_class;
};
