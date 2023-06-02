import {expect, describe, it} from 'vitest';
import any from '@travi/any';

import scaffold from './scaffolder.js';

describe('scaffolder', () => {
  const owner = any.word();
  const name = any.word();

  it('should return scaffolding results', async () => {
    expect(await scaffold({vcs: {owner, name, host: 'github'}}))
      .toEqual({
        badges: {
          status: {
            ossfScorecard: {
              img: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}/badge`,
              link: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}`,
              text: 'OpenSSF Scorecard'
            }
          }
        }
      });
  });

  it('should not define a badge if the vcs host is not github', async () => {
    expect((await scaffold({vcs: {owner, name, host: any.word()}})).badges).toBeUndefined();
  });
});
