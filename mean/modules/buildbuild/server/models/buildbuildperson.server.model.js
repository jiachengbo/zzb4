'use strict';

module.exports = function (sequelize, DataTypes) {

  var BuildbuildPerson = sequelize.define('BuildbuildPerson',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      hdId: {
        type: DataTypes.INTEGER,
        comment: '活动Id'
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
      ishow: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否推动前端显示'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      },
      communityId: {
        type: DataTypes.STRING(100),
        comment: '是否推动前端显示'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '是否删除'
      }
    },
    {
      comment: '共驻共建成员 表'
    }
  );

  return BuildbuildPerson;
};
