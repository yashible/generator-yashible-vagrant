'use strict';
var Generator = require('yeoman-generator');
var yaml = require('yamljs');
var _ = require('underscore');
var request = require('sync-request');

var getRoleLastVersion = function (roleName, yo) {
  var roleParts = roleName.split('.');
  var username = roleParts[0];
  var name = roleParts[1];
  yo.log('looking for role, username: ' + username + ', name: ' + name);
  var rolesRes = request('GET',
    'https://galaxy.ansible.com/api/v1/search/roles/?format=json&username=' + username + '&name=' + name);
  var roles = JSON.parse(rolesRes.body).results;
  var role = _.find(roles, function (r) {
    return r.username === username && r.name === name;
  });
  yo.log('found role with id ' + role.role_id);
  var roleVersionsRes = request('GET', 'https://galaxy.ansible.com/api/v1/roles/' + role.role_id + '/versions/');
  var versions = JSON.parse(roleVersionsRes.body).results;
  var version = _.first(versions);
  yo.log('using version ' + version.name + ' for role ' + roleName);
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
    var roleName = this.options.name;
    var srcFilter = function (r) {
      return r.src === roleName;
    };
    if (_.find(requirements, srcFilter) === undefined) {
      requirements.push({src: roleName, version: getRoleLastVersion(roleName, this)});
    }
    this.fs.write(requirementsPath, yaml.stringify(requirements, 4, 2));
  }
});
