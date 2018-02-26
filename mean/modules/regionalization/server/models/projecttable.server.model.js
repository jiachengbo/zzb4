'use strict';

module.exports = function (sequelize, DataTypes) {
  //项目管理表
  var ProjectTable = sequelize.define('ProjectTable',
    {
      ProjectId: {
        type: DataTypes.STRING,
        autoIncrement: false,
       // primaryKey: true,
        allowNull: false
      },
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      super: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '关联上级'
      },
      roleid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '角色'
      },
      ProjectName: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '项目名称'
      },
      ProjectType: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '项目类型'
      },
      ProjectLogo: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '项目logo'
      },
      ProjectRank: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '项目星级'
      },
      Source: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '项目来源'
      },
      Measure: {
        type: DataTypes.STRING(1000),
        defaultValue: '',
        comment: '具体推进措施'
      },
      ProjectSummary: {
        type: DataTypes.STRING(4000),
        defaultValue: '',
        comment: '项目介绍'
      },
      State: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '项目状态'
      },
      Studies: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '是否需要常任理事会研究'
      },
      Report: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '上报社区id'
      },
      SbTime: {
        type: DataTypes.DATE,
        comment: '申报时间'
      },
      YearTime: {
        type: DataTypes.STRING,
        comment: '项目年份'
      },
      FinishTime: {
        type: DataTypes.DATE,
        comment: '完成时间'
      },
      People: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '受益人数'
      },
      Head: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '负责人'
      },
      company: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '认领单位'
      },
      approvedDepartment: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '审批部门'
      },
      ApprovedTime: {
        type: DataTypes.DATE,
        comment: '审批时间'
      },
      ispast: {
        type: DataTypes.INTEGER,
        comment: '是否通过'
      },
      isfinish: {
        type: DataTypes.INTEGER,
        comment: '是否结项'
      },
      refuse: {
        type: DataTypes.STRING(1000),
        defaultValue: '',
        comment: '驳回原因'
      },
      communityid: {
        type: DataTypes.STRING(200),
        comment: '社区id'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      createUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '创建人id'
      },
      createDate: {
        type: DataTypes.STRING,
        comment: '创建时间'
      },
      modifyUserId: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '修改人id'
      },
      modifyDate: {
        type: DataTypes.STRING,
        comment: '修改时间'
      },
      isStreet: {
        type: DataTypes.INTEGER,
        comment: '是否通过'
      },
      is_syn: {
        type: DataTypes.INTEGER,
        comment: '是否通过'
      },
      isPhoneDJ: {
        type: DataTypes.INTEGER,
        comment: '是否通过'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '街道id'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '等级'
      },
      arrlist: {
        type: DataTypes.STRING,
        comment: '参与支部表'
      },
      PartyBranchID: {
        type: DataTypes.INTEGER,
        comment: '党支部'
      }
    },
    {
      comment: '党建项目',
      classMethods: {
        associate: function (models) {
          this.hasMany(models.ProjectRenList,
            {foreignKey: 'proID', targetKey: 'id'});
        }
      }
    }
  );

  return ProjectTable;
};
