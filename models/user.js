var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataType){
        return sequelize.define('user',{
             email: {
                 type: DataType.STRING,
                 allowNull: false,
                 unique: true,
                 validate: {
                    isEmail: true
                 }
             },
             salt: {
                 type: DataType.STRING
             },
             password_hash: {
                type: DataType.STRING
             },
             password: {
                 	type: DataType.VIRTUAL,       // change datatype to virtual from string
                 	allowNull: false,
                 	validate: {
                 		len: [7,50]
                  	},
                  set: function (value) {
                          var salt = bcrypt.genSaltSync(10);                  // 10 -> length of salt key
                          var hashedPassword = bcrypt.hashSync(value, salt);

                          this.setDataValue('password',value);
                          this.setDataValue('salt',salt);
                          this.setDataValue('password_hash',hashedPassword);
                          }  
            }
        }, {
        hooks: {
          beforeValidate: function(user, options){
            if (typeof user.email === 'string')
              user.email = user.email.toLowerCase();
          }
        },
        instanceMethods: {                               //instanceMethods is an object
            toPublicJSON: function () {
            var json = this.toJSON();
            return _.pick(json,'id','email','password','createdAt','updatedAt');
          } 
        }
      });        
} 