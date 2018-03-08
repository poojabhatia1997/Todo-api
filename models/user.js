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
           password: {
           	type: DataType.STRING,
           	allowNull: false,
           	validate: {
           		len: [7,50]
            	}
           }
      }, {
        hooks: {
          beforeValidate: function(user, options){
            if (typeof user.email === 'string')
              user.email = user.email.toLowerCase();
          }
        }
      });        
} 