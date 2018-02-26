'use strict';

module.exports = function (sequelize, DataTypes) {

  var Threelessons = sequelize.define('Threelessons',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: 'title'
      },
      content: {
        type: DataTypes.STRING(4000),
        defaultValue: '',
        comment: 'content'
      },
      photo: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: 'photo'
      },
      file_path: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '文件'
      },
      starttime: {
        type: DataTypes.DATE,
        comment: 'starttime'
      },
      endtime: {
        type: DataTypes.DATE,
        comment: 'endtime'
      },
      head: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '负责人'
      },
      peoplenum: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: 'peoplenum'
      },
      remarks: {
        type: DataTypes.STRING(1000),
        defaultValue: '',
        comment: 'remarks'
      },
      isdelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'isdelete'
      },
      createuserid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'createuserid'
      },
      createdate: {
        type: DataTypes.DATE,
        comment: 'createdate'
      },
      phone: {
        type: DataTypes.STRING(20),
        defaultValue: '',
        comment: 'phone'
      },
      address: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: 'address'
      },
      gradeId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '层级id'
      },
      objId: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '对象id'
      }
    },
    {
      comment: 'threelessons table'
    }
  );

  return Threelessons;
};
