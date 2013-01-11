Tasks = new Meteor.Collection('tasks');

Tasks.allow({
	insert: function(userId, tasks) {
		return false;
	},
	update: function(userId, tasks, fields, modifier) {
		return true;
	},
	remove: function(userId, tasks) {
		return _.all(tasks, function(task){return task.done;});
	}
});

Meteor.methods({
	createTask: function(options) {
		Tasks.insert(
			{
				title: options.title,
				description: options.description,
				creator: 'armansu',
				done: false
			});
	}
});
