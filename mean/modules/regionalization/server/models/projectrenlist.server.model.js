'use strict';

module.exports = function (sequelize, DataTypes) {
  // 问题墙 关系表
  var ProjectRenList = sequelize.define('ProjectRenList',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      proID: {
        type: DataTypes.INTEGER,
        comment: 'Id'
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
      name: {
        type: DataTypes.STRING,
        comment: '参与者'
      },
      belongGrid: {
        type: DataTypes.STRING,
        comment: '网格Id'
      },
      super: {
        type: DataTypes.STRING,
        comment: '上级党委'
      },
      creatUserName: {
        type: DataTypes.STRING,
        comment: '创建者名称'
      },
      createDate: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        comment: '创建时间'
      },
      creatuUserGrade: {
        type: DataTypes.STRING,
        comment: '创建者等级'
      },
      creatUserRole: {
        type: DataTypes.STRING,
        comment: '创建者角色'
      },
      creatUserBranch: {
        type: DataTypes.STRING,
        comment: '创建者支部id'
      }
    },
    {
      comment: '党建项目关系表',
      indexes: [
        {
          //在外键上建立索引
          fields: ['proID']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.ProjectTable,
            {foreignKey: 'proID'});
        }
      }
    }
  );

  return ProjectRenList;
};
