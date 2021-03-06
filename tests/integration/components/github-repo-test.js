import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import PageObject from 'ember-cli-page-object';
import githubRepoComponent from 'code-corps-ember/tests/pages/components/github-repo';

let page = PageObject.create(githubRepoComponent);

const {
  set,
  run
} = Ember;

function renderPage() {
  page.render(hbs`
    {{#github-repo model=model}}
      Block Content
    {{/github-repo}}
  `);
}

moduleForComponent('github-repo', 'Integration | Component | github repo', {
  integration: true,
  beforeEach() {
    page.setContext(this);
  },
  afterEach() {
    page.removeContext();
  }
});

test('it renders the github repo name', function(assert) {
  assert.expect(1);
  let githubRepo = { name: 'code-corps-ember', isLoaded: true };
  set(this, 'model', { githubRepo });
  renderPage();
  assert.equal(page.name.text, 'code-corps-ember');
});

test('it changes state based on loading, presence of records', function(assert) {
  assert.expect(4);

  set(this, 'model', {});

  renderPage();

  run(() => set(this, 'model.githubRepo', { isLoaded: false }));
  assert.equal(page.text, 'Loading...', 'With github repo loading and no project github repo, state should be loading.');

  run(() => set(this, 'model.githubRepo.isLoaded', true));
  assert.equal(page.text, 'Block Content', 'With github repo loaded and no project github repo, state should be loaded.');

  run(() => set(this, 'model.projectGithubRepo', { isLoaded: false }));
  assert.equal(page.text, 'Loading...', 'With project github repo loading, state should be loading.');

  run(() => set(this, 'model.projectGithubRepo.isLoaded', true));
  assert.equal(page.text, 'Block Content', 'With project github repo loaded, state should be loaded.');
});

test('it changes state based on projectGithubRepo model state', function(assert) {
  assert.expect(3);

  set(this, 'model', {});

  renderPage();

  run(() => set(this, 'model.githubRepo', { isLoaded: true }));

  run(() => set(this, 'model.projectGithubRepo', { isLoaded: true, isSaving: false, isDeleted: false }));
  assert.equal(page.text, 'Block Content', 'With project github repo in default state, state should be default.');

  run(() => set(this, 'model.projectGithubRepo', { isLoaded: true, isSaving: true, isDeleted: false }));
  assert.equal(page.text, 'Connecting...', 'With project github repo in saving state, state should be saving.');

  run(() => set(this, 'model.projectGithubRepo', { isLoaded: true, isSaving: true, isDeleted: true }));
  assert.equal(page.text, 'Disconnecting...', 'With project github repo in deleted and saving state, state should be deleting.');

});
