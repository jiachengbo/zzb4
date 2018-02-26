'use strict';

module.exports = function (sequelize, DataTypes) {

  var LittleWishTable = sequelize.define('LittleWishTable',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: false,
        allowNull: false
      },
      littleId: {
        type: DataTypes.STRING,
        // autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      littleTitle: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'littleTitle'
      },
      littleContent: {
        type: DataTypes.STRING,
        comment: 'littleContent'
      },
      littleDate: {
        type: DataTypes.STRING,
        comment: 'littleDate'
      },
      littlePerson: {
        type: DataTypes.STRING,
        comment: 'littlePerson'
      },
      littleClaimant: {
        type: DataTypes.STRING,
        comment: 'littleClaimant'
      },
      littleClaimDate: {
        type: DataTypes.STRING,
        comment: 'littleClaimDate'
      },
      littleStatus: {
        type: DataTypes.STRING,
        comment: 'littleStatus'
      },
      nPassReason: {
        type: DataTypes.STRING,
        comment: 'nPassReason'
      },
      littleNum: {
        type: DataTypes.INTEGER,
        comment: 'littleNum'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        comment: 'isdelete'
      },
      createUserId: {
        type: DataTypes.STRING,
        comment: 'createUserId'
      },
      createDate: {
        type: DataTypes.STRING,
        comment: 'createDate'
      },
      modifyUserId: {
        type: DataTypes.STRING,
        comment: 'modifyUserId'
      },
      modifyDate: {
        type: DataTypes.INTEGER,
        comment: 'modifyDate'
      },
      littlePhoto: {
        type: DataTypes.STRING,
        comment: '心愿图片path'
      },
      littltCon: {
        type: DataTypes.STRING,
        comment: 'littltCon'
      },
      issend: {
        type: DataTypes.INTEGER,
        comment: 'issend'
      },
      tx: {
        type: DataTypes.INTEGER,
        comment: 'tx'
      },
      streetID: {
        type: DataTypes.INTEGER,
        comment: '街道ID'
      },
      communityID: {
        type: DataTypes.STRING,
        comment: '社区ID'
      },
      grid: {
        type: DataTypes.STRING,
        comment: '网格'
      },
      gridID: {
        type: DataTypes.STRING,
        comment: '网格ID'
      },
      genersuper: {
        type: DataTypes.INTEGER,
        comment: '所属党总支'
      },
      ClaimTime: {
        type: DataTypes.STRING,
        comment: 'ClaimTime'
      },
      isPhoneDJ: {
        type: DataTypes.INTEGER,
        comment: 'isPhoneDJ'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '成员等级Id'
      },
      roleId: {
        type: DataTypes.INTEGER,
        comment: '成员角色Id'
      },
      PartyBranchID: {
        type: DataTypes.INTEGER,
        comment: '党支部ID'
      },
      super: {
        type: DataTypes.INTEGER,
        comment: '上级党组织ID 1-30'
      },
      sbphone: {
        type: DataTypes.STRING,
        comment: '发布人电话'
      },
      claimphone: {
        type: DataTypes.STRING,
        comment: '认领人电话'
      },
      imgFile: {
        type: DataTypes.STRING,
        comment: '图片路径'
      }
    },
    {
      comment: '微心愿表',
      tableName: 'LittleWishTable'
    }
  );

  return LittleWishTable;
};
