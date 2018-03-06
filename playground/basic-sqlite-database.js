var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqilite-database.sqlite'
});

var todo = sequelize.define('todo', {
	description:{
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,250]
		}
	},
	completed:{
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

sequelize.sync({force: true}).then( function () {
     console.log('Everything is synced');
      
     todo.create({
     	description: 'Go to market',
     	completed: true
     }).then(function () {
     	return todo.create({
     		description: 'Result coming!',
     		completed: false
     	});
     }).then(function () {
     	return todo.findById(1);
     }).then(function (Todo) {
          if (Todo){
          	console.log(Todo.toJSON());
          }else{
          	console.log('Todo not found!');
          }
     });

     // todo.create({
	    //  	description: 'Walking my dog',
	    //  	//completed: true
	    //  }).then(function (Todo) {
	    //      // console.log('Finished!');
	    //      // console.log(todo);
	    //      return todo.create({
	    //      	description: "Go to market"
	    //      });
	    //  }).then(function () {
	    //     //	return todo.findById(1);
	    //       return todo.findAll({
	    //       	where: {
	    //       	       completed: false
	    //       	   }
     //            });
	    //  }).then(function (Todos) {
	    //  	if (Todos) {
	    //  		Todos.forEach(function (Todo){
	    //  			console.log(Todo.toJSON());
	    //  		})
	     		
	    //  	}else{
	    //  		console.log('Todo not found!');
	    //  	}
	    //  }).catch(function (e) {
	    //  	console.log(e);
     //     }); 
});