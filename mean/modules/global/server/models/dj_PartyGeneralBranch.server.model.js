'use strict';
var path = require('path'),
  dbExtend = require(path.resolve('./config/lib/dbextend'));
module.exports = function (sequelize, DataTypes) {

  var dj_PartyGeneralBranch = sequelize.define('dj_PartyGeneralBranch',
    {
      branchID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      branchName: {
        type: DataTypes.STRING,
        comment: '党总支名称'
      },
      GradeID: {
        type: DataTypes.STRING,
        comment: '党总支等级'
      },
      simpleName: {
        type: DataTypes.STRING,
        comment: '党总支简称'
      },
      superior: {
        type: DataTypes.INTEGER,
        comment: '上级党组织'
      },
      generalbranch: {
        type: DataTypes.INTEGER,
        comment: '上级总支'
      },
      mold: {
        type: DataTypes.INTEGER,
        comment: '组织类型'
      }
    },
    {
      comment: '党工委、党委党总支信息表',
      indexes: [
        {
          //在外键上建立索引
          fields: ['superior']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.dj_PartyOrganization,
            {foreignKey: 'superior'});
        }
      }
    }
  );
  dbExtend.addBaseCode('dj_PartyGeneralBranch', {
    attributes: ['branchID', 'GradeID', 'branchName', 'simpleName', 'superior', 'generalbranch', 'mold']
  });
  return dj_PartyGeneralBranch;
};
