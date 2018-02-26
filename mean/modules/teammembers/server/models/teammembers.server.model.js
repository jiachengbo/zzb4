'use strict';

module.exports = function (sequelize, DataTypes) {

  var Teammembers = sequelize.define('Teammembers',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: '序号'
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '姓名'
      },
      sex: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '性别'
      },
      duty: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '职务'
      },
      work_unit: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '工作单位'
      },
      type_style: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '类型'
      },
      photo: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '人员照片'
      },
      remark: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: '备注'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        comment: '层级id'
      },
      objId: {
        type: DataTypes.INTEGER,
        comment: '对象id'
      }
    },
    {
      comment: 'teammembers table'
    }
  );

  return Teammembers;
};
