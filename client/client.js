// Actual logic

Meteor.autosubscribe(function() {
    Meteor.subscribe('tasks');
});

Session.set('done_object', { $lte: true});
Session.set('hide_finished', false);
Session.set('showCreateDialog', false);
Session.set('search_query', $('.search_box').val());

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
    'keyup .search_box': function() {
        Session.set('search_query', $('.search_box').val());
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
            creator: Meteor.user() ? Meteor.user().profile.name : 'Stranger'
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

// Some css style tweeks for loginButtons
$(function() {
    $('.login-button').addClass('btn');
});
