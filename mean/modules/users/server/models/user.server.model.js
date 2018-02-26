/*'use strict';

/!**
 * User Model
 *!/

var crypto = require('crypto'),
  path = require('path'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test'),
  dbExtend = require(path.resolve('./config/lib/dbextend')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      lastName: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      displayName: {
        type: DataTypes.STRING(100),
        defaultValue: ''
      },
      email: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        defaultValue: '',
        //使用小写用户名
        get: function () {
          return this.getDataValue('username').toLowerCase();
        },
        set: function (val) {
          this.setDataValue('username', val.toLowerCase());
        }
      },

      salt: {
        type: DataTypes.STRING(64)
      },
      password: {
        type: DataTypes.STRING(128),
        defaultValue: '123456'
      },
      IDNumber: {
        type: DataTypes.STRING(50),
        defaultValue: '身份证号'
      },
      profileImageURL: {
        type: DataTypes.STRING(128),
        defaultValue: '/modules/users/client/img/profile/default.png'
      },
      JCDJ_UserID: {
        type: DataTypes.INTEGER,
        defaultValue: ''
      },
      JCDJ_User_roleID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '角色'
      },
      phone: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '电话号'
      },
      is_syn: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '是否同步'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '街道'
      },
      CreateUser: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '创建者'
      },
      is_delete: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '是否删除'
      },
      communityID: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '社区id'
      },
      branch: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '党支部'
      },
      comnumID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '党支部'
      },
      user_grade: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '层级'
      },
      jobs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '用户等级'
      },
      branchSimpleName: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '党支部名称'
      },
      userpassword: {
        type: DataTypes.STRING(128),
        defaultValue: '',
        comment: '密码'
      },
      roles: {
        type: DataTypes.STRING(255),
        defaultValue: 'user',
        comment: '单独权限'
      },
/!*
      roles: {
        type: DataTypes.STRING(255),
        defaultValue: 'user',
        comment: '单独权限'
      },
      department_id: {
        type: DataTypes.INTEGER,
        //默认部门id
        defaultValue: 1,
        comment: 'foreignKey department(id)'
      },
      provider: {
        type: DataTypes.STRING,
        defaultValue: 'local'
      },
      providerData: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      additionalProvidersData: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      /!* For reset password *!/
      resetPasswordToken: {
        type: DataTypes.STRING(64)
      },
      resetPasswordExpires: {
        type: DataTypes.DATE
      }
    },
    {
      comment: 'user table',
      // 定义表名, user是oracle关键字
      tableName: 'userinfo',
      getterMethods: {
        roles: dbExtend.getterMethodArray
      },
      setterMethods: {
        roles: dbExtend.setterMethodArray
      },
      // 添加时间戳属性 (updatedAt, createdAt),覆盖sequelize默认值
      timestamps: true,
      indexes: [
        {
          //在外键上建立索引
          fields: ['department_id']
        }
      ],

      instanceMethods: {
        toJSON: function () {
          var values = this.get({
            plain: true
          });
          delete values.password;
          delete values.salt;
          delete values.providerData;
          delete values.additionalProvidersData;
          delete values.resetPasswordToken;
          delete values.resetPasswordExpires;
          return values;
        },
        getProfileImageDefault: function () {
          return User.rawAttributes.profileImageURL.defaultValue;
        },
        makeSalt: function () {
          return crypto.randomBytes(16).toString('base64');
        },
        authenticate: function (plainText) {
          return this.encryptPassword(plainText, this.salt) === this.password;
        },
        encryptPassword: function (password, salt) {
          if (salt && password) {
            return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
          } else {
            return password;
          }
/!*
          if (!password || !salt) {
            return '';
          }
          salt = new Buffer(salt, 'base64');
          return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
*!/
        },
        //提取岗位权限，合并到roles
        setWpsRoles: function (logging) {
          var WorkPosition = sequelize.model('WorkPosition');
          var Role = sequelize.model('Role');
          var self = this;

          return WorkPosition.findAll(Object.assign({
            attributes: [],
            include: [
              {
                model: User,
                through: {
                  as: 'wpu',
                  attributes: []
                },
                attributes: [],
                where: {id: self.id}
              },
              {
                model: Role,
                through: {
                  as: 'wpr',
                  attributes: []
                },
                attributes: ['id', 'name']
              }
            ]}, logging === false ? {logging: false} : {}))
            .then(function (result) {
              var roles = self.roles ? self.roles.slice() : [];
              var rolesaddnum = 0;
              for (var i = 0; i < result.length; i++) {
                //roles = roles.concat(result[i].get('Roles', {plain: true}));
                var wps_roles = result[i].get('Roles', {plain: true});
                for (var j = 0; j < wps_roles.length; j++) {
                  if (roles.indexOf(wps_roles[j].name) === -1) {
                    roles.push(wps_roles[j].name);
                    rolesaddnum ++;
                  }
                }
              }
              if (rolesaddnum > 0) {
                //logger.info('user ' + self.username + 'roles from ', self.roles, ' to and workposition roles: ', roles);
                //不改变roles字段更改标志，直接改变内容
                self.set('roles', roles, {raw: true, reset: true});
              }
              return self;
            })
            .catch(function (error) {
              logger.error('getWpsRoles error:', error);
              throw error;
            });
        }
      },

      classMethods: {
        associate: function (models) {
//          this.hasMany(models.Article,
//            {foreignKey: 'user_id', targetKey: 'id'});
          this.belongsTo(models.Department,
            {foreignKey: 'department_id'});
          this.belongsToMany(models.WorkPosition, {
            //简短字段名，oracle限制总长不能超过30个字符，查询时include中的别名必须与此相同
            //会替换系列函数名称setWorkPosition=>setWps, 实体变量中的字段WorkPositions=>wps
            as: 'wps',
            through: models.WorkPositionUser,
            foreignKey: 'user_id'
          });
          //设置本表向外提供基础代码服务,需要加入工作岗位
          //关联函数，在数据模型都定义后，才调用，所以此时workposition有效
          var WorkPosition = sequelize.model('WorkPosition');
          dbExtend.addBaseCode('User',
            {
              attributes: ['id', 'username', 'displayName', 'department_id', 'roles'],
              include: [
                {
                  model: WorkPosition,
                  as: 'wps',
                  through: {
                    as: 'wpu',
                    attributes: []
                  },
                  attributes: ['id', 'name']
                }
              ],
              order: 'createdAt ASC'
            }, {after_find: function (results, logging) {
              //合并用户的岗位权限
              var promiseArray = results.map(function (v) {
                return v.setWpsRoles(logging);
              });
              return Promise.all(promiseArray);
            }});
        },
        findUniqueUsername: function (username, suffix, callback) {
          var _this = this;
          var possibleUsername = username.toLowerCase() + (suffix || '');

          _this.findOne({
            username: possibleUsername
          }).then(function (user) {
            if (!user) {
              callback(possibleUsername);
            } else {
              return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
          }).catch(function (err) {
            callback(null);
          });
        },
        //生成显示名称
        genDisplayName: function (firstn, lastn) {
          var displayn;
          if (firstn && lastn) {
            displayn = firstn + ' ' + lastn;
          } else if (firstn) {
            displayn = firstn;
          } else {
            displayn = lastn;
          }
          return displayn;
        },
        /!**
         * Generates a random passphrase that passes the owasp test.
         * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
         * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
         *!/
        generateRandomPassphrase: function () {
          return new Promise(function (resolve, reject) {
            var password = '';
            var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

            // iterate until the we have a valid passphrase.
            // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
            while (password.length < 20 || repeatingCharacters.test(password)) {
              // build the random password
              password = generatePassword.generate({
                length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
                numbers: true,
                symbols: false,
                uppercase: true,
                excludeSimilarCharacters: true
              });

              // check if we need to remove any repeating characters.
              password = password.replace(repeatingCharacters, '');
            }

            // Send the rejection back if the passphrase fails to pass the strength test
            if (owasp.test(password).errors.length) {
              reject(new Error('An unexpected problem occured while generating the random passphrase'));
            } else {
              // resolve with the validated passphrase
              resolve(password);
            }
          });
        }
      }
    }
  );

  return User;
};*/
'use strict';

/**
 * User Model
 */

var crypto = require('crypto'),
  path = require('path'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test'),
  dbExtend = require(path.resolve('./config/lib/dbextend')),
  logger = require(path.resolve('./config/lib/logger')).getLogger_FileNameBase(__filename);

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      lastName: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      displayName: {
        type: DataTypes.STRING(100),
        defaultValue: ''
      },
      email: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        defaultValue: '',
        //使用小写用户名
        get: function () {
          return this.getDataValue('username').toLowerCase();
        },
        set: function (val) {
          this.setDataValue('username', val.toLowerCase());
        }
      },


      salt: {
        type: DataTypes.STRING(64)
      },
      password: {
        type: DataTypes.STRING(128),
        defaultValue: '123456'
      },
      profileImageURL: {
        type: DataTypes.STRING(128),
        defaultValue: '/modules/users/client/img/profile/default.png',
        comment: '头像'
      },
      roles: {
        type: DataTypes.STRING(255),
        defaultValue: 'user',
        comment: '单独权限'
      },
      department_id: {
        type: DataTypes.INTEGER,
        //默认部门id
        defaultValue: 1,
        comment: 'foreignKey department(id)'
      },
      provider: {
        type: DataTypes.STRING,
        defaultValue: 'local'
      },
      providerData: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      additionalProvidersData: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      /* For reset password */
      resetPasswordToken: {
        type: DataTypes.STRING(64)
      },
      resetPasswordExpires: {
        type: DataTypes.DATE
      },
      IDNumber: {
        type: DataTypes.STRING(50),
        defaultValue: '身份证号'
      },
      JCDJ_UserID: {
        type: DataTypes.INTEGER,
        defaultValue: ''
      },
      JCDJ_User_roleID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '角色'
      },
      phone: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '电话号'
      },
      is_syn: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '是否同步'
      },
      streetID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '街道'
      },
      CreateUser: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '创建者'
      },
      is_delete: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '是否删除'
      },
      communityID: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '社区id'
      },
      branch: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '党支部'
      },
      comnumID: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '党支部'
      },
      user_grade: {
        type: DataTypes.INTEGER,
        defaultValue: '',
        comment: '层级'
      },
      jobs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '用户等级'
      },
      branchSimpleName: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '党支部名称'
      },
      userpassword: {
        type: DataTypes.STRING(128),
        defaultValue: '',
        comment: '密码'
      }
    },
    {
      comment: 'user table',
      // 定义表名, user是oracle关键字
      tableName: 'userinfo',
      getterMethods: {
        roles: dbExtend.getterMethodArray
      },
      setterMethods: {
        roles: dbExtend.setterMethodArray
      },
      // 添加时间戳属性 (updatedAt, createdAt),覆盖sequelize默认值
      timestamps: true,
      indexes: [
        {
          //在外键上建立索引
          fields: ['department_id', 'branch']
        }
      ],

      instanceMethods: {
        toJSON: function () {
          var values = this.get({
            plain: true
          });
          delete values.password;
          delete values.salt;
          delete values.providerData;
          delete values.additionalProvidersData;
          delete values.resetPasswordToken;
          delete values.resetPasswordExpires;
          return values;
        },
        getProfileImageDefault: function () {
          return User.rawAttributes.profileImageURL.defaultValue;
        },
        makeSalt: function () {
          return crypto.randomBytes(16).toString('base64');
        },
        authenticate: function (plainText) {
          return this.encryptPassword(plainText, this.salt) === this.password;
        },
        encryptPassword: function (password, salt) {
          if (salt && password) {
            return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
          } else {
            return password;
          }
          /*
           if (!password || !salt) {
           return '';
           }
           salt = new Buffer(salt, 'base64');
           return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
           */
        },
        //提取岗位权限，合并到roles
        setWpsRoles: function (logging) {
          var WorkPosition = sequelize.model('WorkPosition');
          var Role = sequelize.model('Role');
          var self = this;

          return WorkPosition.findAll(Object.assign({
            attributes: [],
            include: [
              {
                model: User,
                through: {
                  as: 'wpu',
                  attributes: []
                },
                attributes: [],
                where: {id: self.id}
              },
              {
                model: Role,
                through: {
                  as: 'wpr',
                  attributes: []
                },
                attributes: ['id', 'name']
              }
            ]}, logging === false ? {logging: false} : {}))
            .then(function (result) {
              var roles = self.roles ? self.roles.slice() : [];
              var rolesaddnum = 0;
              for (var i = 0; i < result.length; i++) {
                //roles = roles.concat(result[i].get('Roles', {plain: true}));
                var wps_roles = result[i].get('Roles', {plain: true});
                for (var j = 0; j < wps_roles.length; j++) {
                  if (roles.indexOf(wps_roles[j].name) === -1) {
                    roles.push(wps_roles[j].name);
                    rolesaddnum ++;
                  }
                }
              }
              if (rolesaddnum > 0) {
                //logger.info('user ' + self.username + 'roles from ', self.roles, ' to and workposition roles: ', roles);
                //不改变roles字段更改标志，直接改变内容
                self.set('roles', roles, {raw: true, reset: true});
              }
              return self;
            })
            .catch(function (error) {
              logger.error('getWpsRoles error:', error);
              throw error;
            });
        }
      },

      classMethods: {
        associate: function (models) {
//          this.hasMany(models.Article,
//            {foreignKey: 'user_id', targetKey: 'id'});
          this.belongsTo(models.dj_PartyBranch,
            {foreignKey: 'branch'});
          this.belongsTo(models.Department,
            {foreignKey: 'department_id'});
          this.belongsToMany(models.WorkPosition, {
            //简短字段名，oracle限制总长不能超过30个字符，查询时include中的别名必须与此相同
            //会替换系列函数名称setWorkPosition=>setWps, 实体变量中的字段WorkPositions=>wps
            as: 'wps',
            through: models.WorkPositionUser,
            foreignKey: 'user_id'
          });
          //设置本表向外提供基础代码服务,需要加入工作岗位
          //关联函数，在数据模型都定义后，才调用，所以此时workposition有效
          var WorkPosition = sequelize.model('WorkPosition');
          dbExtend.addBaseCode('User',
            {
              attributes: { exclude: ['password', 'salt', 'providerData',
                'additionalProvidersData', 'resetPasswordToken', 'resetPasswordExpires']},
              include: [
                {
                  model: WorkPosition,
                  as: 'wps',
                  through: {
                    as: 'wpu',
                    attributes: []
                  },
                  attributes: ['id', 'name']
                }
              ],
              order: 'createdAt ASC'
            }, {after_find: function (results, logging) {
              //合并用户的岗位权限
              var promiseArray = results.map(function (v) {
                return v.setWpsRoles(logging);
              });
              return Promise.all(promiseArray);
            }});
        },
        findUniqueUsername: function (username, suffix, callback) {
          var _this = this;
          var possibleUsername = username.toLowerCase() + (suffix || '');

          _this.findOne({
            username: possibleUsername
          }).then(function (user) {
            if (!user) {
              callback(possibleUsername);
            } else {
              return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
          }).catch(function (err) {
            callback(null);
          });
        },
        //生成显示名称
        genDisplayName: function (firstn, lastn) {
          var displayn;
          if (firstn && lastn) {
            displayn = firstn + ' ' + lastn;
          } else if (firstn) {
            displayn = firstn;
          } else {
            displayn = lastn;
          }
          return displayn;
        },
        /**
         * Generates a random passphrase that passes the owasp test.
         * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
         * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
         */
        generateRandomPassphrase: function () {
          return new Promise(function (resolve, reject) {
            var password = '';
            var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

            // iterate until the we have a valid passphrase.
            // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
            while (password.length < 20 || repeatingCharacters.test(password)) {
              // build the random password
              password = generatePassword.generate({
                length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
                numbers: true,
                symbols: false,
                uppercase: true,
                excludeSimilarCharacters: true
              });

              // check if we need to remove any repeating characters.
              password = password.replace(repeatingCharacters, '');
            }

            // Send the rejection back if the passphrase fails to pass the strength test
            if (owasp.test(password).errors.length) {
              reject(new Error('An unexpected problem occured while generating the random passphrase'));
            } else {
              // resolve with the validated passphrase
              resolve(password);
            }
          });
        }
      }
    }
  );

  return User;
};
