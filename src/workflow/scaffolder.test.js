import {promises as fs} from 'node:fs';
import jsYaml from 'js-yaml';
import mkdir from 'make-dir';

import {afterEach, expect, describe, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import scaffold from './scaffolder.js';

vi.mock('node:fs');
vi.mock('js-yaml');
vi.mock('make-dir');

describe('workflow scaffolder', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the scorecard workflow', async () => {
    const dumpedYaml = any.string();
    const pathToCreatedWorkflowsDirectory = any.string();

    when(mkdir).calledWith(`${projectRoot}/.github/workflows`).mockResolvedValue(pathToCreatedWorkflowsDirectory);
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
                uses: 'actions/checkout@v4.1.7',
                with: {'persist-credentials': false}
              },
              {
                name: 'Run analysis',
                uses: 'ossf/scorecard-action@v2.4.0',
                with: {
                  results_file: 'results.sarif',
                  results_format: 'sarif',
                  publish_results: true
                }
              },
              {
                name: 'Upload artifact',
                uses: 'actions/upload-artifact@v4.3.4',
                with: {
                  name: 'SARIF file',
                  path: 'results.sarif',
                  'retention-days': 5
                }
              },
              {
                name: 'Upload to code-scanning',
                uses: 'github/codeql-action/upload-sarif@v3.25.15',
                with: {sarif_file: 'results.sarif'}
              }
            ]
          }
        }
      })
      .mockReturnValue(dumpedYaml);

    await scaffold({projectRoot});

    expect(fs.writeFile).toHaveBeenCalledWith(`${pathToCreatedWorkflowsDirectory}/scorecard.yml`, dumpedYaml);
  });
});
