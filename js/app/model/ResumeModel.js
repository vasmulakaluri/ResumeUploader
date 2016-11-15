var ResumeModel = Backbone.Model.extend({

  type: 'text/.*',

  sectionHeaders: {
    name: ['NAME'],
    email: ['EMAIL'],
    phone: ['PHONE'],
    summary: ['SUMMARY', 'OBJECTIVE'],
    experience: [
      'WORK EXPERIENCE',
      'EXPERIENCE',
      'EMPLOYMENT HISTORY',
      'EMPLOYMENT'
    ],
    education: ['EDUCATION'],
    skills: ['SKILLS', 'KEY SKILLS', 'TECHNICAL SKILLS']
  },

  contentExpressions: {
    phone: /(\(?\d{3}\)?[\-\s]?\d{3}[\-\s]?\d{4})/gi,
    email: /((.+)@(.+){2,}\.(.+){2,})/gi,
  },

  initialize: function() {

  },

  validate: function(attributes) {
    var matcher = new RegExp(this.type, 'gi');
    var file = attributes.file;
    if (!matcher.test(file.type)) {
      return false;
    }
  },

  getFileContent: function(callback) {
    var reader = new FileReader();

    reader.onload = function(event) {
      callback(event.target.result);
    }
    reader.readAsText(this.get('file'));
  },

  getContent: function() {
    var fileContent = this.getFileContent(this.parseContent.bind(this));
  },

  parseContent: function(rawContent) {
    var content = {};

    content.name = this.parseName(rawContent);
    content.phone = this.parsePhone(rawContent);
    content.email = this.parseEmail(rawContent);

    var lines = rawContent.split('\n');
    for (var i = 0; i < lines.length; i++) {
      this.parseBody(lines[i], content);
    }
    this.set({content: content});
    this.trigger('change', content);
  },

  parseName: function(content) {
    return content.split('\n')[0];
  },

  parsePhone: function(content) {
    var matches = content.match(this.contentExpressions.phone);
    return matches[0];
  },

  parseEmail: function(content) {
    var matches = content.match(this.contentExpressions.email);
    return matches[0];
  },

  parseBody: function(line, content) {
    if (line.length === 0) {
      if (Array.isArray(content[_header])) {
        content[_header].push("");
      }
      return;
    }

    for (key in this.sectionHeaders) {
      var headers = this.sectionHeaders[key];
      for (var i = 0; i < headers.length; i++) {
        var matcher =  this.getExpression(headers[i]);
        var matches = matcher.exec(line);
        if (matches) {
          content[key] = matches[1] || [];
          content._header = key;
          return;
        }
      }
    }

    if (content._header) {
      var _header = content._header;
      if (Array.isArray(content[_header])) {
          content[_header].push(line);
      }
    }
  },

  getExpression: function(text) {
    var separators = '[:\\-\\s|]*';
    var capture = '(.+$)?';
    var expression = text + separators + capture;
    return new RegExp(expression, 'gi')
  }

});
