'use strict';

module.exports = function (sequelize, DataTypes) {

  var dj_MemberRelationIn = sequelize.define('dj_MemberRelationIn',
    {
      shipId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      memberName: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '姓名'
      },
      sex: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '性别'
      },
      card: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '身份证号码'
      },
      nation: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '民族'
      },
      birth: {
        type: DataTypes.DATE,
        comment: '出生年月'
      },
      place: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '籍贯'
      },
      outBranch: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '所在支部（转出）'
      },
      tel: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '联系方式'
      },
      jointime: {
        type: DataTypes.DATE,
        comment: '入党时间'
      },
      workplace: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '工作单位'
      },
      address: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '家庭地址'
      },
      partycost: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '月交党费'
      },
      inBranch: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '转入党支部'
      },
      inCommittee: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '转入党（工）委'
      },
      attribute: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '所属（转出）'
      },
      phonePath: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '介绍信照片'
      },
      filePath1: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '附件1'
      },
      filePath2: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '附件2'
      },
      filePath3: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '附件3'
      },
      committeeAgreement: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '党（工）委意见'
      },
      organizationAgreement: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '区组织部意见'
      },
      reason: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '档案审核未通过原因'
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '状态 1支部通过，2党（工）委通过，3区组织部通过'
      },
      createUser: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '创建人ID'
      },
      createDate: {
        type: DataTypes.DATE,
        comment: '创建时间'
      },
      isDelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      }
    },
    {
      comment: '党员关系转入信息表'
    }
  );

  return dj_MemberRelationIn;
};
