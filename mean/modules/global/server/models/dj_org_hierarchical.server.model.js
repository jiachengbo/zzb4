'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_org_hierarchical = sequelize.define('dj_org_hierarchical',
    {
      org_hie_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      hie_Name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'dj_org_hierarchical table'//,
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
  dbExtend.addBaseCode('dj_org_hierarchical', {attributes: ['org_hie_ID', 'hie_Name']});
  return dj_org_hierarchical;
};
