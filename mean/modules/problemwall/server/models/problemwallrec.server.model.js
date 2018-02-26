'use strict';

module.exports = function (sequelize, DataTypes) {
  // 问题墙 关系表
  var ProblemWallRec = sequelize.define('ProblemWallRec',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      wtId: {
        type: DataTypes.INTEGER,
        comment: '问题Id'
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
      generalBranch: {
        type: DataTypes.INTEGER,
        comment: '党总支'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街道Id'
      },
      communityId: {
        type: DataTypes.STRING,
        comment: '社区Id'
      },
      belongGrid: {
        type: DataTypes.STRING,
        comment: '网格Id'
      },
      createUserName: {
        type: DataTypes.STRING,
        comment: '上报党组织'
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        comment: '创建时间'
      },
      isCreateUser: {
        type: DataTypes.STRING,
        comment: '是否创建问题者'
      },
      sbs: {
        type: DataTypes.STRING,
        comment: '上报indexs'
      },
      xfs: {
        type: DataTypes.STRING,
        comment: '下发indexs'
      }
    },
    {
      comment: '问题墙关系表',
      tableName: 'ProblemWallRec',
      indexes: [
        {
          //在外键上建立索引
          fields: ['wtId']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.ProblemWall,
            {foreignKey: 'wtId'});
        }
      }
    }
  );

  return ProblemWallRec;
};
