import {promises as fs} from 'node:fs';
import {load} from 'js-yaml';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the workflow is defined', async function () {
  assert.deepEqual(load(await fs.readFile(`${this.projectRoot}/.github/workflows/scorecard.yml`, 'utf-8')), {});
});
