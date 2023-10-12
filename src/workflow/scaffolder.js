import {promises as fs} from 'node:fs';
import {dump} from 'js-yaml';
import mkdir from 'make-dir';

export default async function ({projectRoot}) {
  await fs.writeFile(
    `${await mkdir(`${projectRoot}/.github/workflows`)}/scorecard.yml`,
    dump({
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
              uses: 'actions/checkout@v4.1.0',
              with: {'persist-credentials': false}
            },
            {
              name: 'Run analysis',
              uses: 'ossf/scorecard-action@v2.3.0',
              with: {
                results_file: 'results.sarif',
                results_format: 'sarif',
                publish_results: true
              }
            },
            {
              name: 'Upload artifact',
              uses: 'actions/upload-artifact@v3.1.3',
              with: {
                name: 'SARIF file',
                path: 'results.sarif',
                'retention-days': 5
              }
            },
            {
              name: 'Upload to code-scanning',
              uses: 'github/codeql-action/upload-sarif@v2.22.2',
              with: {sarif_file: 'results.sarif'}
            }
          ]
        }
      }
    })
  );
}
