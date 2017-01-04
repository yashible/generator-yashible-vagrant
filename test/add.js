'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');
var yaml = require('yamljs');
var _ = require('underscore');

describe('generator-yashible-vagrant:add', function () {
  this.timeout(10000);

  var addedRole = 'rfhayashi.openjdk';

  before(function () {
    return helpers.run(path.join(__dirname, '../generators/add'))
      .inTmpDir(function (dir) {
        fs.mkdir(dir + '/ansible');
        fs.writeFileSync(dir + '/ansible/requirements.yml', '---\n- src: somerole');
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
});
