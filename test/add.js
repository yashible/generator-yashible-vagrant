'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');
var yaml = require('yamljs');
var _ = require('underscore');

describe('generator-yashible-vagrant:add', function () {
  // increase timeout as the code does http calls
  this.timeout(10000);

  describe('happy path', function () {
    var addedRole = 'rfhayashi.openjdk';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/add'))
        .inTmpDir(function (dir) {
          fs.mkdir(dir + '/ansible');
          fs.writeFileSync(dir + '/ansible/requirements.yml', '---\n- src: somerole');
          fs.writeFileSync(dir + '/ansible/vagrant.yml', '---\n- hosts: all');
        })
        .withArguments([addedRole])
        .toPromise();
    });

    it('it adds role to requirements.yml', function () {
      var content = fs.readFileSync('ansible/requirements.yml', 'utf-8');
      var requirements = yaml.parse(content);
      assert(_.find(requirements, function (r) {
        return r.src === addedRole && r.version !== undefined && r.version !== null;
      }) !== undefined);
    });

    it('it adds role to vagrant.yml', function () {
      var content = fs.readFileSync('ansible/vagrant.yml', 'utf-8');
      var vagrant = yaml.parse(content);
      var playbook = _.first(vagrant);
      assert(playbook.roles.length > 0);
      assert(_.find(playbook.roles, function (r) {
        return r === addedRole;
      }) !== undefined);
    });
  });

  describe('edge cases', function () {
    it('it deals with an empty requirements file', function (done) {
      helpers.run(path.join(__dirname, '../generators/add'))
        .inTmpDir(function (dir) {
          fs.mkdirSync(dir + '/ansible');
          fs.writeFileSync(dir + '/ansible/requirements.yml', '---\n');
          fs.writeFileSync(dir + '/ansible/vagrant.yml', '---\n- hosts: all');
        })
        .withArguments(['rfhayashi.openjdk'])
        .on('end', function () {
          assert.fileContent('ansible/requirements.yml', /rfhayashi\.openjdk/);
          assert.fileContent('ansible/vagrant.yml', /rfhayashi\.openjdk/);

          done();
        });
    });

    it('it shows nice error message if added role does not exist', function (done) {
      helpers.run(path.join(__dirname, '../generators/add'))
        .inTmpDir(function (dir) {
          fs.mkdirSync(dir + '/ansible');
          fs.writeFileSync(dir + '/ansible/requirements.yml', '---');
          fs.writeFileSync(dir + '/ansible/vagrant.yml', '---\n- hosts: all');
        })
        .withArguments(['user.nonexistent'])
        .on('error', function (error) {
          assert.equal(error.message, 'Role user.nonexistent was not found');

          done();
        })
        .on('end', function () {
          assert.ifError(new Error('it should have thrown an error'));

          done();
        });
    });
  });
});
