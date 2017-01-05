'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');
var yaml = require('yamljs');
var _ = require('underscore');

describe('generator-yashible-vagrant:update', function () {
  // increase timeout as the code does http calls
  this.timeout(10000);

  var requirementsContent = '---\n- src: rfhayashi.openjdk';

  before(function () {
    return helpers.run(path.join(__dirname, '../generators/update'))
      .inTmpDir(function (dir) {
        fs.mkdirSync(dir + '/ansible');
        fs.writeFileSync(dir + '/ansible/requirements.yml', requirementsContent);
      })
      .toPromise();
  });

  it('it adds version to roles', function () {
    var content = fs.readFileSync('ansible/requirements.yml', 'utf-8');
    var requirements = yaml.parse(content);
    assert(_.find(requirements, function (r) {
      return r.src === 'rfhayashi.openjdk' && r.version !== undefined && r.version !== null;
    }) !== undefined);
  });
});
