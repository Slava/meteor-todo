Meteor.autosubscribe(function() {
    Meteor.subscribe('tasks');
});

Session.set('search_query', '');
Session.set('done_object', { $lte: true});
Session.set('hide_finished', false);
Session.set('showCreateDialog', false);

Template.page.hide_finished = function() {
    if (Session.get('hide_finished'))
        return true;
    return false;
};

Template.page.tasks = function() {
    return Tasks.find(
        {
            title: {$regex: Session.get('search_query')},
            done: Session.get('done_object')
        });
};

Template.page.showCreateDialog = function () {
  return Boolean(Session.get("showCreateDialog"));
};

Template.page.search_query = function() {
    return Session.get('search_query');
};

Template.task.events({
    'click .checkmark': function() {
        Tasks.update({_id: this._id}, {$set: {done: !this.done}});
    },
    'click .delete': function() {
        if (this.done)
            Tasks.remove({_id: this._id});
        else
            alert('Do this shit first, only then you can delete');
    }
});

Template.page.events({
    'click .go_search': function() {
        Session.set('search_query', $('.searchbox').val());
        Meteor.flush();
    },
    'click .add_task': function() {
        Session.set("showCreateDialog", true);
    },
    'click .hide_finished': function() {
        Session.set('done_object', { $lt: true });
        Session.set('hide_finished', true);
    },
    'click .show_finished': function() {
        Session.set('done_object', { $lte: true });
        Session.set('hide_finished', false);
    },
    'click .remove_finished': function() {
        Tasks.remove({ done: true });
    }
});

Template.createDialog.error = function() {
    return Session.get('createError');
};

Template.createDialog.events({
  'click .save': function (event, template) {
    var title = template.find(".title").value;
    var description = template.find(".description").value;

    if (title.length && description.length) {
        Meteor.call('createTask', {
            title: title,
            description: description,
            creator: user
        });
        Session.set("showCreateDialog", false);
        Session.set("createError", null);
    } else {
      Session.set("createError",
                  "It needs a title and a description, or why bother?");
    }
  },
  'click .cancel': function () {
    Session.set("showCreateDialog", false);
  }
});
