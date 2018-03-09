var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataType){
        var user = sequelize.define('user',{            // Instead of writing return, use var to make a user variable so that it can be accessible in class methods
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
        classMethods: {
           authenticate : function (body) {

                  return new Promise(function (resolve,reject) {
                      if (typeof body.email !== 'string' && typeof body.password !== 'string'){
                           return reject();
                       }
                      user.findOne({
                         where: {
                            email: body.email
                         }
                       }).then(function (user) {
                           if( !user || !bcrypt.compareSync(body.password,user.get('password_hash'))){      //match password entered by user in login and the stired hashed password
                              return reject();
                           }
                            resolve(user);                           
                       }, function (e) {
                            return reject();
                       });   
                   });
           }
        },
      instanceMethods: {                                // create own instance method
          toPublicJSON: function () {                   // this refers to instance(user.toPublicJSON) this means user
                  var json = this.toJSON();
                  return _.pick(json,'id','email','password','createdAt','updatedAt');      //returned methods in res.json
                } ,
          generateToken: function (type) {      // type of the token to generate
              if(!_.isString(type)){
                    return undefined;
                  }
            
              try{
                  var stringData = JSON.stringify({id: this.get('id'), type: type});
                  var encryptedData = cryptojs.AES.encrypt(stringData, 'Privatekey').toString();
                  var token = jwt.sign({
                    token: encryptedData
                  },'secretKey123$!@');

                  return token;

              } catch(e) {
                console.log(e);
                return undefined;
          }
        }
      }
  });           
        return user;
} 








