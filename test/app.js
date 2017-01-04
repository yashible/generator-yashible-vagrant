'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs-extra');

describe('generator-yashible-vagrant:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fs.outputFileSync(dir + '/.gitignore', '');
      })
      .withPrompts({})
      .toPromise();
  });

  it('creates Vagrant file', function () {
    assert.file('Vagrantfile');
  });

  it('creates requirements.yml file', function () {
    assert.file('ansible/requirements.yml');
  });

  it('creates vagrant.yml file', function () {
    assert.file('ansible/vagrant.yml');
  });

  it('creates or updates .gitignore file', function () {
    assert.file('.gitignore');
    assert.fileContent('.gitignore', /\.idea\n/);
    assert.fileContent('.gitignore', /\.vagrant\n/);
    assert.fileContent('.gitignore', /ansible\/roles\n/);
  });
});
