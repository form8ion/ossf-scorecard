import {promises as fs} from 'node:fs';
import jsYaml from 'js-yaml';

import {afterEach, expect, describe, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffold from './scaffolder.js';

vi.mock('node:fs');
vi.mock('js-yaml');

describe('scaffolder', () => {
  const projectRoot = any.string();
  const owner = any.word();
  const name = any.word();
  const dumpedYaml = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return scaffolding results', async () => {
    when(jsYaml.dump).calledWith({}).mockReturnValue(dumpedYaml);

    expect(await scaffold({projectRoot, vcs: {owner, name, host: 'github'}}))
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
    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/.github/workflows/scorecard.yml`, dumpedYaml);
  });

  it('should not define a badge if the vcs host is not github', async () => {
    expect((await scaffold({vcs: {owner, name, host: any.word()}})).badges).toBeUndefined();
  });
});
