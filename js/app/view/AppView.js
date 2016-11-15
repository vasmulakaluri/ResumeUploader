var AppView = Backbone.View.extend({

  el: '#app',

  picker: '#picker',

  events: {
    'click #upload': 'upload',
    'change #picker': 'processFile'
  },

  initialize: function() {
    this.picker = $(this.picker);
  },

  upload: function() {
    this.picker.trigger('click');
  },

  processFile: function(event) {
    this.reset();
    var file = event.target.files[0];
    if (!!file) {
      this.model = new ResumeModel({file: file}, {validate: true});
      this.view = new ResumeView({model: this.model});
      this.model.getContent();
    }
  },

  reset: function() {
    if (this.view) {
      this.view.remove();
    }
    this.model = null;
    this.view = null;
  }

});
