import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('the score badge is added to the status zone', async function () {
  assert.deepEqual(
    this.result.badges.status.ossfScorecard,
    {
      img: `https://api.securityscorecards.dev/projects/github.com/${this.vcsOwner}/${this.vcsName}/badge`,
      link: `https://api.securityscorecards.dev/projects/github.com/${this.vcsOwner}/${this.vcsName}`,
      text: 'OpenSSF Scorecard'
    }
  );
});

Then('no badge is added', async function () {
  assert.isUndefined(this.result.badges);
});
