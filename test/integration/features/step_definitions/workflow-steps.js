import {fileExists} from '@form8ion/core';
import mkdir from 'make-dir';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Given('Actions workflows exist', async function () {
  await mkdir(`${this.projectRoot}/.github/workflows`);
});

Given('no Actions workflows exist', async function () {
  return undefined;
});

Then('the workflow is defined', async function () {
  assert.isTrue(await fileExists(`${this.projectRoot}/.github/workflows/scorecard.yml`));
});

Then('the workflow is not defined', async function () {
  assert.isFalse(await fileExists(`${this.projectRoot}/.github/workflows/scorecard.yml`));
});
