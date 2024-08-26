import {promises as fs} from 'node:fs';
import {workflowFileExists} from '@form8ion/github-workflows-core';

import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';

const scorecareWorkflowName = 'scorecard';

Given('Actions workflows exist', async function () {
  await fs.mkdir(`${this.projectRoot}/.github/workflows`, {recursive: true});
});

Given('no Actions workflows exist', async function () {
  return undefined;
});

Then('the workflow is defined', async function () {
  assert.isTrue(await workflowFileExists({projectRoot: this.projectRoot, name: scorecareWorkflowName}));
});

Then('the workflow is not defined', async function () {
  assert.isFalse(await workflowFileExists({projectRoot: this.projectRoot, name: scorecareWorkflowName}));
});
