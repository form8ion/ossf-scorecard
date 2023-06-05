import {promises as fs} from 'node:fs';
import {dump} from 'js-yaml';

export default async function ({projectRoot, vcs: {owner, name, host}}) {
  await fs.writeFile(`${projectRoot}/.github/workflows/scorecard.yml`, dump({}));

  return {
    ...'github' === host && {
      badges: {
        status: {
          ossfScorecard: {
            text: 'OpenSSF Scorecard',
            img: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}/badge`,
            link: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}`
          }
        }
      }
    }
  };
}
