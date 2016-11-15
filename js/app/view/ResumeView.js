var ResumeView = Backbone.View.extend({

  el: '#resume-display',

  templateName: '#resume-view-template',

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.template = Handlebars.compile($(this.templateName).html());
  },

  render: function() {
    this.$el.html(this.template(this.model.get('content')));
    this.$el.show();
    return this;
  }

});
