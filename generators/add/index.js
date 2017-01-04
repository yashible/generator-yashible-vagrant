'use strict';
var Generator = require('yeoman-generator');
var yaml = require('yamljs');
var _ = require('underscore');

module.exports = Generator.extend({
  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'The role to be added'
    });
  },

  writing: function () {
    var requirementsPath = this.destinationPath('ansible/requirements.yml');
    var fileContent = this.fs.read(requirementsPath);
    var requirements = yaml.parse(fileContent);
    var roleName = this.options.name;
    var srcFilter = function (r) {
      return r.src === roleName;
    };
    if (_.find(requirements, srcFilter) === undefined) {
      requirements.push({src: roleName});
    }
    this.fs.write(requirementsPath, yaml.stringify(requirements, 4, 2));
  }
});
