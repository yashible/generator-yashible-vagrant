var request = require('sync-request');
var _ = require('underscore');

module.exports = {

  getRole: function (roleName) {
    var roleParts = roleName.split('.');
    var username = roleParts[0];
    var name = roleParts[1];
    var rolesRes = request('GET',
      'https://galaxy.ansible.com/api/v1/search/roles/?format=json&username=' + username + '&name=' + name);
    var roles = JSON.parse(rolesRes.body).results;
    return _.find(roles, function (r) {
      return r.username === username && r.name === name;
    });
  },

  getRoleLatestVersion: function (roleId) {
    var roleVersionsRes = request('GET', 'https://galaxy.ansible.com/api/v1/roles/' + roleId + '/versions/');
    var versions = JSON.parse(roleVersionsRes.body).results;
    var version = _.first(versions);
    return version.name;
  }

};
