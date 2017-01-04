'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Generator.extend({
  prompting: function () {
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-yashible-vagrant') + ' generator!'
    ));

    var prompts = [];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('Vagrantfile'),
      this.destinationPath('Vagrantfile')
    );

    this.fs.copy(
      this.templatePath('ansible/requirements.yml'),
      this.destinationPath('ansible/requirements.yml')
    );
  }
});
