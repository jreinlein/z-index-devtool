var assert = require('assert');
const {createStoreFixture} = require('./fixtures/store-fixture');
const {textMarkup, mockGetTextModule} = require('./fixtures/utils');
const {
  expandNode,
  collapseNode,
  toggleNode
} = require('../src/actions/stacking-context');

describe('store fixture', function () {
  it('has url & text', function (done) {
    createStoreFixture().then((store) => {
      assert.equal(store.getState().stackingContext.url, 'test/test.html', "URL");
      assert.equal(store.getState().stackingContext.text, textMarkup, "Markup");
      done();
    }).catch((err) => {
      done(err);
    });
  });
  it('has tree', function (done) {
    createStoreFixture().then((store) => {
      assert.notEqual(store.getState().stackingContext.tree, undefined, "Tree exists");
      assert.equal(store.getState().stackingContext.tree.length, 2, "Size of Tree");
      done();
    }).catch((err) => {
      done(err);
    });
  });
});

describe('node expansion', function () {
  it('expand tree nodes', function (done) {
    createStoreFixture().then((store) => {
      let expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 0, "Size of expandedNodes 0");
      const tree = store.getState().stackingContext.tree;
      store.dispatch(expandNode(tree[0]));
      expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 1, "Size of expandedNodes 1");
      assert.equal(expandedNodes.has(tree[0]), true, "Tree Element 0");
      store.dispatch(expandNode(tree[1]));
      expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 2, "Size of expandedNodes 2");
      assert.equal(expandedNodes.has(tree[1]), true, "Tree Element 1");
      done();
    }).catch((err) => {
      done(err);
    });
  });

  //todo: child nodes
});

describe('node collapse', function () {
  it('collapse tree nodes', function (done) {
    createStoreFixture().then((store) => {
      let expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 0, "[init] Size of expandedNodes 0");
      const tree = store.getState().stackingContext.tree;
      store.dispatch(expandNode(tree[0]));
      store.dispatch(expandNode(tree[1]));
      expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 2, "Size of expandedNodes 2");
      store.dispatch(collapseNode(tree[0]));
      expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 1, "Size of expandedNodes 1");
      assert.notEqual(expandedNodes.has(tree[0]), true, "Tree Element 0");
      store.dispatch(collapseNode(tree[1]));
      expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 0, "Size of expandedNodes 0");
      assert.notEqual(expandedNodes.has(tree[1]), true, "Tree Element 1");
      done();
    }).catch((err) => {
      done(err);
    });
  });

  //todo: child nodes
});


describe('node toggle', function () {
  it('toggle a node twice (expand, collapse)', function (done) {
    createStoreFixture().then((store) => {
      let expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 0, "[init] Size of expandedNodes 0 by default");
      const tree = store.getState().stackingContext.tree;
      assert.equal(expandedNodes.has(tree[0]), false, "[init] expandedNodes should not contain the toggled node");

      store.dispatch(toggleNode(tree[0]));
      expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 1, "Size of expandedNodes 1 after first toggle");
      assert.equal(expandedNodes.has(tree[0]), true, "expandedNodes should contain the toggled node");

      store.dispatch(toggleNode(tree[0]));
      expandedNodes = store.getState().stackingContext.expandedNodes;
      assert.equal(expandedNodes.size, 0, "Size of expandedNodes back to 0 after second toggle");
      assert.notEqual(expandedNodes.has(tree[0]), true, "expandedNodes should no longer contain the node after two toggles");
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
