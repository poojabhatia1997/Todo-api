var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); 
var db = require('./db.js');
var app = express();

var PORT = process.env.PORT || 3000;
// var todos = [{
// 				id: 1,
// 				description: 'First student',
// 				completed: false
// 	   	    },
// 			{
// 				id: 2,
// 				description: 'Second user',
// 				completed: false
// 			}];	
var todos = [];
var nextTodoId = 1;
app.use(bodyParser.json());				

app.get('/' , function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req,res) {
	// var queryParams = req.query;
	// var filteredTodos = todos;

 //    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
 //    	filteredTodos = _.where(filteredTodos, {'completed': true});
 //    }else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
 //    	filteredTodos = _.where(filteredTodos, {'completed': false});
 //    }
     
 //    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ) {
 //       filteredTodos = _.filter(filteredTodos, function(todo) {
 //            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
 //       });
 //    }
	// res.json(filteredTodos); 

	   var  query = req.query;
	   var where = {}

	   if (query.hasOwnProperty('completed') && query.completed === 'true'){
	   	     where.completed = true 
	   } else if (query.hasOwnProperty('completed') && query.completed === 'false'){
	   	     where.completed = false 
	   }

	   if (query.hasOwnProperty('q') && query.q.length > 0){
	   	  where.description = {
	   	  	$like: '%' + query.q + '%'
	   	  }
	   }

       db.todo.findAll({
       	where: where
       }).then(function (todos) {
       	 if (todos){
       		res.json(todos);
       	 }
       }, function (e) {
         	res.status(500).send();
       });

});

app.get('/todos/:id', function (req,res) {
	var todoid = parseInt( req.params.id, 10 );
	var matchedTodo;
//	var matchedTodo = _.findWhere(todos, {id: todoid});
	// todos.forEach(function (todo) {
	// 	//res.send('Outside loop ' + todoid + todo.id);
	// 	if (todoid === todo.id){
    //          matchedTodo = todo;
          
	// 	 }     
	// });
		
	  //   if (matchedTodo){
   //       	  res.json(matchedTodo);
   //       }
		 //   else{
			// 	res.status(404).send();
			// }


			 db.todo.findById(todoid).then(function (todo){
		    	if(!!todo){
		             res.json(todo.toJSON());                         // using sequlite 
		    	 } else {
		              res.status(404).send();
		    	}
		    },function (e) {
		    	res.status(500).send();
			 });

});

app.post('/todos', function (req, res) {
    //var body = req.body;
     var body = _.pick(req.body, 'description', 'completed');

     db.todo.create(body).then(function (todo) {
           res.json(todo.toJSON());
     }, function (e) {
           res.status(400).json(e);
     });

    // if  (!(_isBoolean(body.completed)) || !(_isString(body.description)))  {
    //       return res.status(404).send();
    // }
    
    // body.id = nextTodoId++;
    // todos.push(body);
    // res.json(body);
});

app.delete('/todos/:id', function (req, res) {
    // var todoid = parseInt(req.params.id,10);
    // var matchedTodo = _.findWhere(todos, {id: todoid});
    // if (!matchedTodo) {
    // 	res.status(404).json({"error": "No todo found with id"});
    // }
    // else{
    //     todos = _.without(todos, matchedTodo);
    //     res.json(matchedTodo);
    // }

    var todoid = parseInt(req.params.id,10);
    db.todo.destroy({
    	where: {
    		id: todoid
    	}
    }).then(function (rowDeleted) {
         if (rowDeleted === 0){
         	res.status(404).json("No todo found!");
         }else{
         	res.status(204).send();
         }
    },function () {
    	res.status(500).send();
    });
});

app.put('/todos/:id', function (req, res) {
	// var todoid = parseInt(req.params.id,10);
 //    var matchedTodo = _.findWhere(todos, {id: todoid});
    
 //    var body =  _.pick(req.body, 'description', 'completed');
 //    var validAttributes = {}

 //    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
 //    	validAttributes.completed = body.completed;
 //    }else if (body.hasOwnProperty('completed')) {
 //        return res.status(400).send();
 //    }

 //    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
 //    	validAttributes.description = body.description;
 //    }else if (body.hasOwnProperty('description')){
 //    	return res.status(400).send();
 //    }


 //    _.extend(matchedTodo, validAttributes);
 //    res.json(matchedTodo);

       var todoid = parseInt(req.params.id, 10);
       var body = _.pick(req.body,'description','completed');
       var attributes = {}

       if(body.hasOwnProperty('description')){
       	  attributes.description = body.description;
       } else if (body.hasOwnProperty('completed')){
       	  attributes.completed = body.completed;
       }
       db.todo.findById(todoid).then(function (todo) {
        	if (todo){
               return todo.update(attributes);
        	}else{
        		res.status(404).send();
        	}
       },function () {
           res.status(500).send();
       }).then(function (todo) {
       	   res.json(todo.toJSON());
       }, function (e) {
       	  res.status(400).send();
       });

      
});

db.sequelize.sync({force: true}).then(function () {
        app.listen(PORT, function () {
            console.log('Express listening on post ' + PORT + '!'); 
    });
});


















