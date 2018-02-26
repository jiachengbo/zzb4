'use strict';

module.exports = function (sequelize, DataTypes) {

  var ProjectTable = sequelize.define('ProjectTable',
    {
      ProjectId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      ProjectName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '项目名称'
      },
      ProjectSummary: {
        type: DataTypes.STRING,
        comment: '项目介绍'
      },
      ProjectLogo: {
        type: DataTypes.STRING,
        comment: '项目logo'
      },
      ProjectRank: {
        type: DataTypes.INTEGER,
        comment: '项目星级'
      },
      Source: {
        type: DataTypes.STRING,
        comment: '项目来源'
      },
      ProjectType: {
        type: DataTypes.STRING,
        comment: '项目类型'
      },
      Measure: {
        type: DataTypes.STRING,
        comment: '具体推进措施'
      },
      People: {
        type: DataTypes.STRING,
        comment: '受益人数'
      },
      SbTime: {
        type: DataTypes.STRING,
        comment: '申报时间'
      },
      FinishTime: {
        type: DataTypes.STRING,
        comment: '完成时间'
      },
      Head: {
        type: DataTypes.STRING,
        comment: '负责人'
      },
      State: {
        type: DataTypes.STRING,
        comment: '项目状态'
      },
      Studies: {
        type: DataTypes.STRING,
        comment: '是否需要常任理事会研究'
      },
      Report: {
        type: DataTypes.STRING,
        comment: '上报社区'
      },
      company: {
        type: DataTypes.STRING,
        comment: '认领单位'
      },
      refuse: {
        type: DataTypes.STRING,
        comment: '驳回原因'
      },
      ApprovedTime: {
        type: DataTypes.STRING,
        comment: '审批时间'
      },
      YearTime: {
        type: DataTypes.STRING,
        comment: '日期id'
      },
      approvedDepartment: {
        type: DataTypes.STRING,
        comment: '审批部门'
      },
      ispast: {
        type: DataTypes.INTEGER,
        comment: '是否通过'
      },
      isfinish: {
        type: DataTypes.INTEGER,
        comment: '是否结项'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        comment: '是否删除'
      },
      createUserId: {
        type: DataTypes.STRING,
        comment: '创建人id'
      },
      createDate: {
        type: DataTypes.STRING,
        comment: '创建时间'
      },
      modifyUserId: {
        type: DataTypes.STRING,
        comment: '修改人id'
      },
      modifyDate: {
        type: DataTypes.STRING,
        comment: '修改时间'
      },
      isStreet: {
        type: DataTypes.INTEGER,
        comment: '是否街办'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街办id'
      },
      is_syn: {
        type: DataTypes.INTEGER,
        comment: '是否同步'
      },
      isPhoneDJ: {
        type: DataTypes.INTEGER,
        comment: '手机端使用'
      },
      PartyBranchID: {
        type: DataTypes.INTEGER,
        comment: '党支部id'
      }
    },
    {
      comment: '街道党建项目表'/*,
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

  return ProjectTable;
};
