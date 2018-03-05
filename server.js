var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); 

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
	res.json(todos);  
});

app.get('/todos/:id', function (req,res) {
	var todoid = parseInt( req.params.id, 10 );
	var matchedTodo = _.findWhere(todos, {id: todoid});
	// todos.forEach(function (todo) {
	// 	//res.send('Outside loop ' + todoid + todo.id);
	// 	if (todoid === todo.id){
 //            matchedTodo = todo;
          
	// 	 }     
	// });

	if (matchedTodo){
         	  res.json(matchedTodo);
         }
		   else{
				res.status(404).send();
			}
});

app.post('/todos', function (req, res) {
    //var body = req.body;
     var body = _.pick(req.body, 'description', 'completed');
    // if  (!(_isBoolean(body.completed)) || !(_isString(body.description)))  {
    //       return res.status(404).send();
    // }

    body.id = nextTodoId++;
    todos.push(body);
    res.json(body);
});

app.listen(PORT, function () {
	console.log('Express listening on post ' + PORT + '!'); 
})