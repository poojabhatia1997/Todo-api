var crypto = require('crypto-js');

var middleware = function(db) {
     return {
     	requireAuthentication: function (req, res, next){
             var token = req.get('Auth') || '';
             db.token.findOne({
                where: {
                    tokenHash: crypto.MD5(token).toString()
                }
             }).then(function (tokenInstance) {
                  if(!tokenInstance) {
                    console.log("4");
                   throw new Error(); 
                  }
                  req.token = tokenInstance;
                  return db.user.findByToken(token);
             }).then(function(user) {
               req.user = user;
               next();
             }).catch(function () {
                res.status(401).send();
             });



             // db.user.findByToken(token).then(function (user) {
             //     req.user = user;
             //     next();
             // }, function (e) {
             // 	res.status(401).json({"error":"Token not found!"});
             // });
     	}
     };
};
 module.exports = middleware;