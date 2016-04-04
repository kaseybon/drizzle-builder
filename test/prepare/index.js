/* global describe, it */
var chai = require('chai');
var config = require('../config');
var expect = chai.expect;
var options = require('../../dist/options');
var prepare = require('../../dist/prepare/');

describe ('prepare/index', () => {
  const opts = options(config.fixtureOpts);
  it ('should resolve to an options object', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts).to.be.an('object');
      expect(preparedOpts).to.contain.keys('handlebars');
    });
  });
  it ('should prepare helpers', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.helpers).to.contain.keys(
        'toFraction', 'toJSON', 'toSlug'
      );
      expect(preparedOpts.handlebars.helpers).to.contain.keys(
        'block', 'embed', 'content'
      );
    });
  });
  it ('should register layouts as partials', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'default', 'page', 'collection'
      );
    });
  });
  it ('should prepare partials', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'header', 'menu'
      );
      expect(preparedOpts.handlebars.partials).to.contain.keys('nested.thing');
      expect(preparedOpts.handlebars.partials).to.contain.keys('default');
    });
  });
  it ('should prepare pattern partials', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.partials).to.contain.keys(
        'patterns.pink',
        'patterns.components.button.base',
        'patterns.components.button.color-variation'
      );
    });
  });
  it ('should register the `pattern` helper', () => {
    return prepare(opts).then(preparedOpts => {
      expect(preparedOpts.handlebars.helpers).to.contain.key('pattern');
    });
  });
});
