import {promises as fs} from 'node:fs';
import {writeWorkflowFile} from '@form8ion/github-workflows-core';

export default async function ({projectRoot}) {
  await fs.mkdir(`${projectRoot}/.github/workflows`, {recursive: true});

  await writeWorkflowFile({
    projectRoot,
    name: 'scorecard',
    config: {
      name: 'OpenSSF Scorecard',
      on: {
        // To guarantee Maintained check is occasionally updated.
        // See https://github.com/ossf/scorecard/blob/main/docs/checks.md#maintained
        schedule: [{cron: '31 2 * * 1'}],
        push: {branches: ['master']}
      },
      permissions: 'read-all',
      jobs: {
        analysis: {
          name: 'Scorecard analysis',
          'runs-on': 'ubuntu-latest',
          permissions: {
            // Needed to upload the results to code-scanning dashboard.
            'security-events': 'write',
            // Needed to publish results and get a badge (see publish_results below).
            'id-token': 'write'
          },
          steps: [
            {
              name: 'Checkout code',
              uses: 'actions/checkout@v4.2.2',
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
              uses: 'actions/upload-artifact@v4.4.3',
              with: {
                name: 'SARIF file',
                path: 'results.sarif',
                'retention-days': 5
              }
            },
            {
              name: 'Upload to code-scanning',
              uses: 'github/codeql-action/upload-sarif@v3.27.6',
              with: {sarif_file: 'results.sarif'}
            }
          ]
        }
      }
    }
  });
}
