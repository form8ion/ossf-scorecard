import {expect, describe, it} from 'vitest';
import any from '@travi/any';

import scaffold from './scaffolder.js';

describe('scaffolder', () => {
  it('should return scaffolding results', async () => {
    const owner = any.word();
    const name = any.word();

    expect(await scaffold({vcs: {owner, name}}))
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
});
