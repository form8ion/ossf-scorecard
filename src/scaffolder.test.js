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

  it('should create the scorecard workflow and define the badge if the vcs host is github', async () => {
    when(jsYaml.dump)
      .calledWith({
        name: 'OpenSSF Scorecard',
        on: {
          schedule: [{cron: '31 2 * * 1'}],
          push: {branches: ['master']}
        },
        permissions: 'read-all',
        jobs: {
          analysis: {
            name: 'Scorecard analysis',
            'runs-on': 'ubuntu-latest',
            permissions: {
              'security-events': 'write',
              'id-token': 'write'
            },
            steps: [
              {
                name: 'Checkout code',
                uses: 'actions/checkout@v3.1.0',
                with: {'persist-credentials': false}
              },
              {
                name: 'Run analysis',
                uses: 'ossf/scorecard-action@v2.1.2',
                with: {
                  results_file: 'results.sarif',
                  results_format: 'sarif',
                  publish_results: true
                }
              },
              {
                name: 'Upload artifact',
                uses: 'actions/upload-artifact@v3.1.0',
                with: {
                  name: 'SARIF file',
                  path: 'results.sarif',
                  'retention-days': 5
                }
              },
              {
                name: 'Upload to code-scanning',
                uses: 'github/codeql-action/upload-sarif@v2.2.4',
                with: {sarif_file: 'results.sarif'}
              }
            ]
          }
        }
      })
      .mockReturnValue(dumpedYaml);

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

  it('should not define a scorecard workflow or a badge if the vcs host is not github', async () => {
    expect((await scaffold({vcs: {owner, name, host: any.word()}})).badges).toBeUndefined();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
});
