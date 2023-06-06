import {Given} from '@cucumber/cucumber';

Given('the project is hosted on {string}', async function (vcsHost) {
  this.vcsHost = vcsHost.toLowerCase();
});
