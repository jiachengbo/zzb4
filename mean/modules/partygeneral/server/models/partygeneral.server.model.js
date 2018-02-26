'use strict';

module.exports = function (sequelize, DataTypes) {

  var Partygeneral = sequelize.define('Partygeneral',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'title'
      },
      content: {
        type: DataTypes.TEXT,
        comment: 'content'
      },
      tfloat: {
        type: DataTypes.FLOAT,
        comment: 'ttt'
      },
      tdouble: {
        type: DataTypes.DOUBLE(10, 2),
        comment: 'TTT=>NUMBER(15,5)'
      },
      tdecimal: {
        type: DataTypes.DECIMAL(6, 2),
        comment: 'TTT'
      },
      treal: {
        type: DataTypes.REAL(6, 2),
        comment: 'TTT=>FLOAT(63)'
      },
      tnumber: {
        type: DataTypes.NUMERIC(8, 2)
      },
      tdate: {
        type: DataTypes.DATE,
        comment: 'TTT=>TIMESTAMP(6) WITH LOCAL TIME ZONE'
      },
      tdateonly: {
        type: DataTypes.DATEONLY,
        comment: 'TTT=>DATE'
      },
      ttime: {
        type: DataTypes.TIME,
        comment: 'TTT=>TIMESTAMP(6) WITH LOCAL TIME ZONE'
      },
      tblob: {
        type: DataTypes.BLOB,
        comment: 'TTT'
      },
      user_id: {
        type: DataTypes.INTEGER,
        comment: 'foreignKey user(id)'
      }
    },
    {
      comment: 'partygeneral table'
      /*indexes: [
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

  return Partygeneral;
};
