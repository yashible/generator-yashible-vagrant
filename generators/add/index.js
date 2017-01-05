'use strict';
var Generator = require('yeoman-generator');
var yaml = require('yamljs');
var _ = require('underscore');
var request = require('sync-request');

var getRole = function (roleName) {
  var roleParts = roleName.split('.');
  var username = roleParts[0];
  var name = roleParts[1];
  var rolesRes = request('GET',
    'https://galaxy.ansible.com/api/v1/search/roles/?format=json&username=' + username + '&name=' + name);
  var roles = JSON.parse(rolesRes.body).results;
  return _.find(roles, function (r) {
    return r.username === username && r.name === name;
  });
};

var getRoleLatestVersion = function (roleId) {
  var roleVersionsRes = request('GET', 'https://galaxy.ansible.com/api/v1/roles/' + roleId + '/versions/');
  var versions = JSON.parse(roleVersionsRes.body).results;
  var version = _.first(versions);
  return version.name;
};

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
    if (requirements === null) {
      requirements = [];
    }
    var roleName = this.options.name;
    var srcFilter = function (r) {
      return r.src === roleName;
    };

    if (_.find(requirements, srcFilter) === undefined) {
      this.log('Looking for role: ' + roleName);
      var role = getRole(roleName, this);
      if (role === undefined) {
        this.env.error('Role ' + roleName + ' was not found');
      }
      var roleVersion = getRoleLatestVersion(role.role_id, this);
      var req = {src: roleName};
      if (roleVersion !== null) {
        req.version = roleVersion;
      }
      requirements.push(req);
    }
    this.fs.write(requirementsPath, yaml.stringify(requirements, 4, 2));
  }
});
