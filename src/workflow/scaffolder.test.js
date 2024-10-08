import {promises as fs} from 'node:fs';
import {writeWorkflowFile} from '@form8ion/github-workflows-core';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import scaffold from './scaffolder.js';

vi.mock('node:fs');
vi.mock('@form8ion/github-workflows-core');

describe('workflow scaffolder', () => {
  const projectRoot = any.string();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should scaffold the scorecard workflow', async () => {
    await scaffold({projectRoot});

    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github/workflows`, {recursive: true});
    expect(writeWorkflowFile).toHaveBeenCalledWith({
      projectRoot,
      name: 'scorecard',
      config: {
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
                uses: 'actions/checkout@v4.2.1',
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
                uses: 'actions/upload-artifact@v4.4.1',
                with: {
                  name: 'SARIF file',
                  path: 'results.sarif',
                  'retention-days': 5
                }
              },
              {
                name: 'Upload to code-scanning',
                uses: 'github/codeql-action/upload-sarif@v3.26.12',
                with: {sarif_file: 'results.sarif'}
              }
            ]
          }
        }
      }
    });
  });
});
