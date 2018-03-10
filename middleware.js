
var middleware = function(db) {
     return {
     	requireAuthentication: function (req, res, next){
             var token = req.get('Auth');
             db.user.findByToken(token).then(function (user) {
                 req.user = user;
                 next();
             }, function (e) {
             	res.status(401).json({"error":"Token not found!"});
             });
     	}
     };
};
 module.exports = middleware;