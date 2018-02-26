'use strict';

module.exports = function (sequelize, DataTypes) {

  var dj_PartyMember = sequelize.define('dj_PartyMember',
    {
      PartyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      PartyName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党员姓名'
      },
      PartyNation: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '民族'
      },
      PartySex: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党员性别'
      },
      PartyBirth: {
        type: DataTypes.DATE,
        comment: '出生日期'
      },
      PartyPlace: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '籍贯'
      },
      IDNumber: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '身份证号'
      },
      WorkPlace: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '工作单位'
      },
      TelNumber: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '联系电话'
      },
      BelongGrid: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属网格'
      },
      JoinTime: {
        type: DataTypes.DATE,
        comment: '入党时间'
      },
      preson_category: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '人员类别'
      },
      ThePartyfor: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党内表彰'
      },
      Income: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '个人收入（月）'
      },
      ToPay: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '缴纳比例'
      },
      PartyMoney: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '每月党费'
      },
      Remark: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '备注'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      createUserId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '创建人ID'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      modifyUserId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '修改人ID'
      },
      modifyDate: {
        type: DataTypes.DATE,
        comment: '修改时间'
      },
      branch: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所在党支部ID'
      },
      communityId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所属社区'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所属街道'
      },
      Specialty: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '个人特长'
      },
      isJob: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '是否在职党员'
      },
      jobReason: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '在职原因'
      },
      isPhoneDJ: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否手机创建'
      },
      workbranch: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所在党组织Id'
      },
      partycom: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'partycom'
      },
      comstringId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所在社区int'
      },
      education: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '学历'
      },
      education2: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '学历'
      },
      Category: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党员类别'
      },
      zhuanzheng_date: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '转正时间'
      },
      party_status: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'party_status'
      },
      isConcat: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否失联党员'
      },
      notConcat_date: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'notConcat_date'
      },
      isFlow_party: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否流动党员'
      },
      flow_place: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'flow_place'
      },
      sections: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '认领单位报到社区'
      }
    },
    {
      comment: '区党员表',
      indexes: [
        {
          fields: ['branch']
        }
      ],
      classMethods: {
        associate: function (models) {
          this.belongsTo(models.dj_PartyBranch,
            {foreignKey: 'branch'});
        }
      }
    }
  );

  return dj_PartyMember;
};
