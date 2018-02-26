'use strict';

module.exports = function (sequelize, DataTypes) {

  var ProblemWall = sequelize.define('ProblemWall',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      wtTitle: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '标题'
      },
      wtContent: {
        type: DataTypes.STRING,
        comment: '问题内容'
      },
      super: {
        type: DataTypes.INTEGER,
        comment: '上报党组织'
      },
      genersuper: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '上报党总支'
      },
      pt: {
        type: DataTypes.STRING,
        comment: '当前处理平台(升降)'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '成员等级Id'
      },
      roleId: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '成员角色Id'
      },
      branchId: {
        type: DataTypes.INTEGER,
        comment: '成员所在党支部Id'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街道Id'
      },
      communityId: {
        type: DataTypes.STRING,
        comment: '社区Id'
      },
      gridId: {
        type: DataTypes.STRING,
        comment: '网格Id'
      },
      photoPath1: {
        type: DataTypes.STRING,
        comment: '问题图片1'
      },
      photoPath2: {
        type: DataTypes.STRING,
        comment: '问题图片2'
      },
      photoPath3: {
        type: DataTypes.STRING,
        comment: '问题图片3'
      },
      hfContent: {
        type: DataTypes.STRING,
        comment: '回复内容'
      },
      issb: {
        type: DataTypes.INTEGER,
        comment: '是否上报'
      }
    },
    {
      comment: '问题墙表',
      tableName: 'ProblemWall',
      classMethods: {
        associate: function (models) {
          this.hasMany(models.ProblemWallRec,
            {foreignKey: 'wtId', targetKey: 'id'});
        }
      }
    }
  );

  return ProblemWall;
};
