'use strict';
var Generator = require('yeoman-generator');
var yaml = require('yamljs');
var _ = require('underscore');
var galaxy = require('../galaxy');

module.exports = Generator.extend({
  writing: function () {
    var requirementsPath = this.destinationPath('ansible/requirements.yml');
    var requirementsFileContent = this.fs.read(requirementsPath);
    var requirements = yaml.parse(requirementsFileContent);
    if (requirements === null) {
      requirements = [];
    }
    _.each(requirements, function (r) {
      var role = galaxy.getRole(r.src);
      r.version = galaxy.getRoleLatestVersion(role.role_id);
    });
    this.fs.write(requirementsPath, yaml.stringify(requirements, 4, 2));
  }
});
