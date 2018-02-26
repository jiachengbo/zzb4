'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_grid = sequelize.define('dj_grid',
    {
      gridID: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false
      },
      gridName: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: ''
      },
      gridNum: {
        type: DataTypes.STRING(20),
        defaultValue: '',
        comment: ''
      },
      communityID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      }
    },
    {
      comment: 'grid table'//,
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
  dbExtend.addBaseCode('dj_grid', {attributes: ['gridID', 'gridName', 'gridNum', 'communityID']});
  return dj_grid;
};
