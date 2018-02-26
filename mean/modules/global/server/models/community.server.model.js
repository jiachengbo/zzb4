'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var community = sequelize.define('community',
    {
      id: {
        type: DataTypes.STRING,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false
      },
      communityId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: '',
        comment: ''
      },
      communityName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      dutyUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: ''
      },
      context: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      createUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      createDate: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      modifyUser: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      modifyDate: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      streetID: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      },
      is_syn: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: ''
      }

    },
    {
      comment: 'community table',
      classMethods: {
        associate: function (models) {
          this.hasMany(models.Threefive,
            {foreignKey: 'communityid', targetKey: 'communityId'});
          /*this.hasMany(models.OrgPerson,
            {foreignKey: 'orgId', targetKey: 'orgId'});
          this.hasMany(models.CommitteeTable,
            {foreignKey: 'Street', targetKey: 'Street'});*/
        }
      }
    }
  );
  dbExtend.addBaseCode('community', {attributes: ['id', 'communityId', 'communityName', 'streetID']});
  return community;
};
