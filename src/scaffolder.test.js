import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import {scaffold as scaffoldWorkflow} from './workflow/index.js';
import scaffold from './scaffolder.js';

vi.mock('./workflow/index.js');

describe('scaffolder', () => {
  const projectRoot = any.string();
  const owner = any.word();
  const name = any.word();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the scorecard workflow and define the badge if the vcs host is github', async () => {
    expect(await scaffold({projectRoot, vcs: {owner, name, host: 'github'}}))
      .toEqual({
        badges: {
          status: {
            ossfScorecard: {
              img: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}/badge`,
              link: `https://securityscorecards.dev/viewer/?uri=github.com/${owner}/${name}`,
              text: 'OpenSSF Scorecard'
            }
          }
        }
      });
    expect(scaffoldWorkflow).toHaveBeenCalledWith({projectRoot});
  });

  it('should not define a scorecard workflow or a badge if the vcs host is not github', async () => {
    expect((await scaffold({vcs: {owner, name, host: any.word()}})).badges).toBeUndefined();
    expect(scaffoldWorkflow).not.toHaveBeenCalled();
  });
});
