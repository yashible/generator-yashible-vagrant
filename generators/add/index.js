'use strict';
var Generator = require('yeoman-generator');
var yaml = require('yamljs');
var _ = require('underscore');
var galaxy = require('../galaxy');

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
    var requirementsFileContent = this.fs.read(requirementsPath);
    var requirements = yaml.parse(requirementsFileContent);
    if (requirements === null) {
      requirements = [];
    }
    var roleName = this.options.name;
    var srcFilter = function (r) {
      return r.src === roleName;
    };

    if (_.find(requirements, srcFilter) === undefined) {
      this.log('Looking for role: ' + roleName);
      var role = galaxy.getRole(roleName, this);
      if (role === undefined) {
        this.env.error('Role ' + roleName + ' was not found');
      }
      var roleVersion = galaxy.getRoleLatestVersion(role.role_id, this);
      var req = {src: roleName};
      if (roleVersion !== null) {
        req.version = roleVersion;
      }
      requirements.push(req);
    }
    this.fs.write(requirementsPath, yaml.stringify(requirements, 4, 2));

    var vagrantPath = this.destinationPath('ansible/vagrant.yml');
    var vagrantFileContent = this.fs.read(vagrantPath);
    var vagrant = yaml.parse(vagrantFileContent);
    var playbook = _.first(vagrant);
    if (playbook.roles === undefined) {
      playbook.roles = [];
    }
    var roles = playbook.roles;
    if (!_.contains(roles, roleName)) {
      roles.push(roleName);
    }
    this.fs.write(vagrantPath, yaml.stringify(vagrant, 4, 2));
  }
});
