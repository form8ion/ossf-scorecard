import {fileExists} from '@form8ion/core';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the workflow is defined', async function () {
  assert.isTrue(await fileExists(`${this.projectRoot}/.github/workflows/scorecard.yml`));
});
