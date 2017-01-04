'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-yashible-vagrant:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({})
      .toPromise();
  });

  it('creates Vagrant file', function () {
    assert.file('Vagrantfile');
  });
});
