'use strict';

module.exports = function (sequelize, DataTypes) {

  var dj_ProjectManagement = sequelize.define('dj_ProjectManagement',
    {
      projectId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      projectName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'projectName'
      },
      type_ID: {
        type: DataTypes.INTEGER,
        comment: 'type_ID'
      },
      projectLogo: {
        type: DataTypes.STRING,
        comment: 'ttt'
      },
      projectDescription: {
        type: DataTypes.STRING,
        comment: '项目描述'
      },
      pushMeasures: {
        type: DataTypes.STRING,
        comment: 'pushMeasures'
      },
      reportDept_ID: {
        type: DataTypes.INTEGER,
        comment: '上报部门'
      },
      reportTime: {
        type: DataTypes.STRING,
        comment: '上报时间'
      },
      expectedCompletionTime: {
        type: DataTypes.STRING,
        comment: '拟完成时间'
      },
      expectedBeneficiaries: {
        type: DataTypes.INTEGER,
        comment: '受益人数'
      },
      personIinCharge: {
        type: DataTypes.STRING,
        comment: '人员所在支部'
      },
      claimOrganize: {
        type: DataTypes.STRING,
        comment: 'claimOrganize'
      },
      auditDepartment: {
        type: DataTypes.STRING,
        comment: 'auditDepartment'
      },
      auditTime: {
        type: DataTypes.STRING,
        comment: 'auditTime'
      },
      auditStatus: {
        type: DataTypes.INTEGER,
        comment: 'auditStatus'
      },
      endProjectStatus: {
        type: DataTypes.INTEGER,
        comment: 'endProjectStatus'
      },
      rejectReason: {
        type: DataTypes.STRING,
        comment: 'rejectReason'
      },
      source_ID: {
        type: DataTypes.INTEGER,
        comment: 'source_ID'
      },
      isDele: {
        type: DataTypes.INTEGER,
        comment: 'isDele'
      },
      usergrade_ID: {
        type: DataTypes.INTEGER,
        comment: 'usergrade_ID'
      },
      partyCommitte_ID: {
        type: DataTypes.INTEGER,
        comment: 'partyCommitte_ID'
      },
      partyBranch_ID: {
        type: DataTypes.INTEGER,
        comment: 'partyBranch_ID'
      },
      Star: {
        type: DataTypes.INTEGER,
        comment: 'Star'
      }
    },
    {
      comment: '组织部党建项目表'/*,
      indexes: [
        {
          //在外键上建立索引
          fields: ['user_id']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.User,
            {foreignKey: 'user_id'});
        }
      }*/
    }
  );

  return dj_ProjectManagement;
};
