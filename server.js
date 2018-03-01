var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
				id: 1,
				description: 'First student',
				completed: false
	   	    },
			{
				id: 2,
				description: 'Second user',
				completed: false
			}];		

app.get('/' , function (req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function (req,res) {
	res.json(todos);  
});

app.get('/todos/:id', function (req,res) {
	var todoid = parseInt( req.params.id, 10 );
	console.log (typeof todoid);
	console.log (typeof todos.id);
	var matchedTodo;
	todos.forEach(function (todo) {
		//res.send('Outside loop ' + todoid + todo.id);
		if (todoid === todo.id){
            matchedTodo = todo;
          
		 }     
	});
	if (matchedTodo){
         	  res.json(matchedTodo);
         }
		   else{
				res.status(404).send();
			}
});

app.listen(PORT, function () {
	console.log('Express listening on post ' + PORT + '!'); 
})